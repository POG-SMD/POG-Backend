const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function listLink(id) {
  try {
    const link = await prisma.link.findUnique({
      where: {
        id: id,
      },
    });

    if (link) {
      return {
        type: "success",
        message: "Listagem de link bem-sucedida.",
        data: link,
      };
    } else {
      return {
        type: "error",
        message: "Link não existente.",
      };
    }
  } catch (error) {
    console.error("Erro ao listar link:", error);
    throw error;
  }
}

async function listAllLink() {
  try {
    const link = await prisma.link.findMany();

    if (link.length) {
      return {
        type: "success",
        message: "Listagem de links bem-sucedida.",
        data: link,
      };
    } else {
      return {
        type: "error",
        message: "Nenhum link encontrado.",
      };
    }
  } catch (error) {
    console.error("Erro ao listar links:", error);
    throw error;
  }
}

async function updateLink(id, data) {
  try {
    const existingLink = await prisma.link.findUnique({
      where: { id },
    });

    if (!existingLink) {
      return {
        type: "error",
        message: "Link não encontrada para edição.",
      };
    }

    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        title: data.title || existingLink.title,
        link: data.link || existingLink.link,
        description: data.description || existingLink.description,
      },
    });

    return {
      type: "success",
      message: "Link editada com sucesso.",
      data: updatedLink,
    };
  } catch (error) {
    console.error("Erro ao editar link:", error.message);
    return {
      type: "error",
      message: "Erro ao editar o link.",
      error: error.message,
    };
  }
}

async function createLink(data) {
  try {
    const newLink = await prisma.link.create({
      data: {
        link: data.link,
        title: data.title,
        description: data.description,
      },
    });

    return {
      type: "success",
      message: "Link criado com sucesso.",
      data: newLink,
    };
  } catch (error) {
    console.error("Erro ao criar link:", error);
    throw error;
  }
}

async function deleteLink(id) {
  try {
    const link = await prisma.link.findUnique({
      where: {
        id: id,
      },
    });

    if (!link) {
      return {
        type: "error",
        message: "Link não encontrado para deletar.",
      };
    }

    await prisma.link.delete({
      where: {
        id: id,
      },
    });

    return {
      type: "success",
      message: "Link deletado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao deletar link:", error);
    throw error;
  }
}

module.exports = {
  listLink,
  listAllLink,
  deleteLink,
  createLink,
  updateLink,
};
