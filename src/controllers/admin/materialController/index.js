const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function listMaterial(id) {
  try {
    const material = await prisma.material.findUnique({
      where: {
        id: id,
      },
    });

    if (material) {
      return {
        type: "success",
        message: "Listagem de material bem-sucedida.",
        data: material,
      };
    } else {
      return {
        type: "error",
        message: "Material não existente.",
      };
    }
  } catch (error) {
    console.error("Erro ao listar material:", error);
    throw error;
  }
}

async function listAllMaterial() {
  try {
    const material = await prisma.material.findMany();

    if (material.length) {
      return {
        type: "success",
        message: "Listagem de materiais bem-sucedida.",
        data: material,
      };
    } else {
      return {
        type: "error",
        message: "Nenhum material encontrado.",
      };
    }
  } catch (error) {
    console.error("Erro ao listar materiais:", error);
    throw error;
  }
}

async function updateMaterial(id, data) {
  try {
    const existingMaterial = await prisma.material.findUnique({
      where: { id },
    });

    if (!existingMaterial) {
      return {
        type: "error",
        message: "Material não encontrada para edição.",
      };
    }

    const updatedMaterial = await prisma.material.update({
      where: { id },
      data: {
        title: data.title || existingMaterial.title,
        type: data.type || existingMaterial.type,
        description: data.description || existingMaterial.description,
      },
    });

    return {
      type: "success",
      message: "Material editada com sucesso.",
      data: updatedMaterial,
    };
  } catch (error) {
    console.error("Erro ao editar material:", error.message);
    return {
      type: "error",
      message: "Erro ao editar o material.",
      error: error.message,
    };
  }
}

async function createMaterial(data) {
  try {
    const newMaterial = await prisma.material.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
      },
    });

    return {
      type: "success",
      message: "Material criado com sucesso.",
      data: newMaterial,
    };
  } catch (error) {
    console.error("Erro ao criar material:", error);
    throw error;
  }
}

async function deleteMaterial(id) {
  try {
    const material = await prisma.material.findUnique({
      where: {
        id: id,
      },
    });

    if (!material) {
      return {
        type: "error",
        message: "Material não encontrado para deletar.",
      };
    }

    await prisma.material.delete({
      where: {
        id: id,
      },
    });

    return {
      type: "success",
      message: "Material deletado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao deletar material:", error);
    throw error;
  }
}

module.exports = {
  listMaterial,
  listAllMaterial,
  deleteMaterial,
  createMaterial,
  updateMaterial,
};
