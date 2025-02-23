const { PrismaClient } = require("@prisma/client");
const { statusType } = require("../../enum/statusType");

const prisma = new PrismaClient();

async function listReservation(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
        materials: {
          include: {
            material: true,
          },
        },
      },
    });

    if (reservation) {
      return {
        type: "success",
        message: "Reserva encontrada.",
        data: reservation,
      };
    } else {
      return {
        type: "error",
        message: "Reserva não encontrada.",
      };
    }
  } catch (error) {
    console.error("Erro ao listar reserva:", error);
    throw error;
  }
}

async function listAllReservations() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        user: true,
        materials: {
          include: {
            material: true,
          },
        },
      },
    });

    return {
      type: "success",
      message: "Listagem de reservas bem-sucedida.",
      data: reservations,
    };
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    throw error;
  }
}

const createReservation = async (data) => {
  try {
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        userId: data.userId,
        status: { in: [statusType.PENDENTE, statusType.EM_RESERVA] },
      },
    });

    if (existingReservation) {
      return {
        type: "error",
        message: "Usuário já possui uma reserva ativa ou pendente.",
      };
    }

    const materials = await prisma.material.findMany({
      where: { id: { in: data.materialIds } },
    });

    if (materials.length !== data.materialIds.length) {
      return {
        type: "error",
        message: "Um ou mais materiais não foram encontrados.",
      };
    }

    for (const material of materials) {
      if (material.quantity <= 0) {
        return {
          type: "error",
          message: `Material ${material.title} esgotado.`,
        };
      }
    }

    const newReservation = await prisma.reservation.create({
      data: {
        userId: data.userId,
        type: data.type,
        status: statusType.PENDENTE,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
        materials: {
          create: data.materialIds.map((materialId) => ({
            material: { connect: { id: materialId } },
          })),
        },
      },
      include: { materials: true },
    });

    for (const material of materials) {
      await prisma.material.update({
        where: { id: material.id },
        data: { quantity: material.quantity - 1 },
      });
    }

    return {
      type: "success",
      message: "Reserva criada com sucesso.",
      data: newReservation,
    };
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    throw error;
  }
};

async function cancelReservation(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { materials: true },
    });

    if (!reservation) {
      return {
        type: "error",
        message: "Reserva não encontrada para cancelar.",
      };
    }

    for (const resMaterial of reservation.materials) {
      await prisma.material.update({
        where: { id: resMaterial.materialId },
        data: { quantity: { increment: 1 } },
      });
    }

    await prisma.reservation.update({
      where: { id },
      data: { status: statusType.CANCELADO },
    });

    return {
      type: "success",
      message: "Reserva cancelada com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    throw error;
  }
}

async function deleteReservation(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { materials: true },
    });

    if (!reservation) {
      return { type: "error", message: "Reserva não encontrada para deletar." };
    }

    for (const resMaterial of reservation.materials) {
      await prisma.material.update({
        where: { id: resMaterial.materialId },
        data: { quantity: { increment: 1 } },
      });
    }

    await prisma.reservation.delete({ where: { id } });

    return {
      type: "success",
      message: "Reserva deletada com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    throw error;
  }
}

async function getReservationStatus(userId) {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: { userId },
      orderBy: { id: "desc" }, 
      select: { status: true, id: true },
    });
    

    if (!reservation) {
      return {
        type: "error",
        message: "Nenhuma reserva encontrada para este usuário.",
      };
    }

    return {
      type: "success",
      message: "Status da reserva encontrado.",
      data: { status: reservation.status, reservationId: reservation.id },
    };
  } catch (error) {
    console.error("Erro ao buscar status da reserva:", error);
    return {
      type: "error",
      message: "Erro ao buscar status da reserva.",
      error: error.message,
    };
  }
}

async function acceptReservation(id) {
  try {
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      return {
        type: "error",
        message: "Reserva não encontrada para aceitação.",
      };
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { status: statusType.EM_RESERVA },
    });

    return {
      type: "success",
      message: "Reserva aceita com sucesso.",
      data: updatedReservation,
    };
  } catch (error) {
    console.error("Erro ao aceitar reserva:", error);
    return {
      type: "error",
      message: "Erro ao aceitar a reserva.",
      error: error.message,
    };
  }
}

async function refuseReservation(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { materials: true },
    });

    if (!reservation) {
      return { type: "error", message: "Reserva não encontrada para recusa." };
    }

    for (const resMaterial of reservation.materials) {
      await prisma.material.update({
        where: { id: resMaterial.materialId },
        data: { quantity: { increment: 1 } },
      });
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { status: statusType.RECUSADO },
    });

    return {
      type: "success",
      message: "Reserva recusada com sucesso.",
      data: updatedReservation,
    };
  } catch (error) {
    console.error("Erro ao recusar reserva:", error);
    return {
      type: "error",
      message: "Erro ao recusar a reserva.",
      error: error.message,
    };
  }
}

async function returnReservation(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { materials: true },
    });

    if (!reservation) {
      return { type: "error", message: "Reserva não encontrada para retorno." };
    }

    for (const resMaterial of reservation.materials) {
      await prisma.material.update({
        where: { id: resMaterial.materialId },
        data: { quantity: { increment: 1 } },
      });
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { status: statusType.FINALIZADO },
    });

    return {
      type: "success",
      message: "Reserva finalizada com sucesso.",
      data: updatedReservation,
    };
  } catch (error) {
    console.error("Erro ao finalizar reserva:", error);
    return {
      type: "error",
      message: "Erro ao finalizar a reserva.",
      error: error.message,
    };
  }
}

module.exports = {
  listReservation,
  listAllReservations,
  createReservation,
  acceptReservation,
  refuseReservation,
  returnReservation,
  cancelReservation,
  deleteReservation,
  getReservationStatus,
};
