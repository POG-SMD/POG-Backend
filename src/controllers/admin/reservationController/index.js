const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function listReserva(id) {
  try {
    const reservas = await prisma.reservation.findUnique({
      where: {
        id: id,
      },
    });

    if (reservas) {
      return {
        type: "success",
        message: "Listagem de reserva bem-sucedida.",
        data: reservas,
      };
    } else {
      return {
        type: "error",
        message: "Reserva não existente.",
      };
    }
  } catch (error) {
    console.error("Erro ao listar reserva:", error);
    throw error;
  }
}

async function listAllReserva() {
  try {
    const reservas = await prisma.reservas.findMany();

    if (reservas.length) {
      return {
        type: "success",
        message: "Listagem de reservas bem-sucedida.",
        data: reservas,
      };
    } else {
      return {
        type: "error",
        message: "Nenhuma reserva encontrado.",
      };
    }
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    throw error;
  }
}

async function updateReserva(id, data) {
  try {
    const existingReserva = await prisma.reservas.findUnique({
      where: { id },
    });

    if (!existingReserva) {
      return {
        type: "error",
        message: "Reserva não encontrada para edição.",
      };
    }

    const updatedReserva = await prisma.reservas.update({
      where: { id },
      data: {
        type: data.type || existingReserva.type,
        purpose: data.purpose || existingReserva.purpose,
      },
    });

    return {
      type: "success",
      message: "Reserva editada com sucesso.",
      data: updatedReserva,
    };
  } catch (error) {
    console.error("Erro ao editar reserva:", error.message);
    return {
      type: "error",
      message: "Erro ao editar o reserva.",
      error: error.message,
    };
  }
}

async function createReserva(data) {
  try {
    const newReserva = await prisma.reservas.create({
      data: {
        type: data.type,
        purpose: data.purpose,
      },
    });

    return {
      type: "success",
      message: "Reserva criado com sucesso.",
      data: newReserva,
    };
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    throw error;
  }
}

async function deleteReserva(id) {
  try {
    const reservas = await prisma.reservas.findUnique({
      where: {
        id: id,
      },
    });

    if (!reservas) {
      return {
        type: "error",
        message: "Reserva não encontrado para deletar.",
      };
    }

    await prisma.reservas.delete({
      where: {
        id: id,
      },
    });

    return {
      type: "success",
      message: "Reserva deletado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    throw error;
  }
}

module.exports = {
  listReserva,
  listAllReserva,
  deleteReserva,
  createReserva,
  updateReserva,
};
