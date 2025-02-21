const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function listReservation(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { user: true, material: true }
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
      include: { user: true, material: true }
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
        status: 1,
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

async function updateReservation(id, data) {
  try {
    const existingReservation = await prisma.reservation.findUnique({
      where: { id }
    });

    if (!existingReservation) {
      return { type: "error", message: "Reserva não encontrada para edição." };
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        dateStart: data.dateStart ? new Date(data.dateStart) : existingReservation.dateStart,
        dateEnd: data.dateEnd ? new Date(data.dateEnd) : existingReservation.dateEnd,
        status: data.status || existingReservation.status,
        purpose: data.purpose || existingReservation.purpose,
        type: data.type || existingReservation.type
      }
    });

    return {
      type: "success",
      message: "Reserva editada com sucesso.",
      data: updatedReservation,
    };
  } catch (error) {
    console.error("Erro ao editar reserva:", error);
    return {
      type: "error",
      message: "Erro ao editar a reserva.",
      error: error.message,
    };
  }
}

async function deleteReservation(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id }
    });

    if (!reservation) {
      return { type: "error", message: "Reserva não encontrada para deletar." };
    }

    if (reservation.materialId) {
      const material = await prisma.material.findUnique({
        where: { id: reservation.materialId }
      });

      if (material) {
        await prisma.material.update({
          where: { id: material.id },
          data: { quantity: material.quantity + 1 }
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
  updateReservation,
  deleteReservation,
};
