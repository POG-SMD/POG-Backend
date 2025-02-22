const { PrismaClient } = require("@prisma/client");
const { statusType } = require("../../enum/statusType");

const prisma = new PrismaClient();

async function listReservation(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { user: true, material: true },
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
      include: { user: true, material: true },
    });

    if (reservations.length) {
      return {
        type: "success",
        message: "Listagem de reservas bem-sucedida.",
        data: reservations,
      };
    } else {
      return {
        type: "error",
        message: "Nenhuma reserva encontrada.",
      };
    }
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

    const material = await prisma.material.findUnique({
      where: { id: data.materialId },
    });

    if (!material) {
      return { type: "error", message: "Material não encontrado." };
    }

    if (material.quantity <= 0) {
      return { type: "error", message: "Material esgotado." };
    }

    const newReservation = await prisma.reservation.create({
      data: {
        userId: data.userId,
        materialId: data.materialId,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        purpose: data.purpose,
        type: data.type,
        status: statusType.PENDENTE,
      },
    });

    await prisma.material.update({
      where: { id: data.materialId },
      data: { quantity: material.quantity - 1 },
    });

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

async function acceptReservation(id, data) {
  try {
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      return { type: "error", message: "Reserva não encontrada para edição." };
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: statusType.EM_RESERVA,
      },
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

async function refuseReservation(id, data) {
  try {
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      return { type: "error", message: "Reserva não encontrada para edição." };
    }

    const material = await prisma.material.findUnique({
      where: { id: data.materialId },
    });

    if (!material) {
      return { type: "error", message: "Material não encontrado." };
    }

    await prisma.material.update({
      where: { id: data.materialId },
      data: { quantity: material.quantity + 1 },
    });
    console.log("Status que será definido:", statusType.RECUSADO);

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: statusType.RECUSADO,
      },
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

async function returnReservation(id, data) {
  try {
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      return { type: "error", message: "Reserva não encontrada para edição." };
    }

    const material = await prisma.material.findUnique({
      where: { id: data.materialId },
    });

    if (!material) {
      return { type: "error", message: "Material não encontrado." };
    }

    await prisma.material.update({
      where: { id: data.materialId },
      data: { quantity: material.quantity + 1 },
    });

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: statusType.FINALIZADO,
      },
    });

    return {
      type: "success",
      message: "Reserva retornada com sucesso.",
      data: updatedReservation,
    };
  } catch (error) {
    console.error("Erro ao retornada reserva:", error);
    return {
      type: "error",
      message: "Erro ao retornada a reserva.",
      error: error.message,
    };
  }
}

async function cancelReservation(id, data) {
  try {
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      return { type: "error", message: "Reserva não encontrada para edição." };
    }

    const material = await prisma.material.findUnique({
      where: { id: data.materialId },
    });

    if (!material) {
      return { type: "error", message: "Material não encontrado." };
    }

    await prisma.material.update({
      where: { id: data.materialId },
      data: { quantity: material.quantity + 1 },
    });

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: statusType.CANCELADO,
      },
    });

    return {
      type: "success",
      message: "Reserva cancelada com sucesso.",
      data: updatedReservation,
    };
  } catch (error) {
    console.error("Erro ao cancelada reserva:", error);
    return {
      type: "error",
      message: "Erro ao cancelada a reserva.",
      error: error.message,
    };
  }
}

async function getReservationStatus(userId) {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: { userId },
      select: { status: true },
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
      status: reservation.status,
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

module.exports = { getReservationStatus };

async function deleteReservation(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return { type: "error", message: "Reserva não encontrada para deletar." };
    }

    if (reservation.materialId) {
      const material = await prisma.material.findUnique({
        where: { id: reservation.materialId },
      });

      if (material) {
        await prisma.material.update({
          where: { id: material.id },
          data: { quantity: material.quantity + 1 },
        });
      }
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
