const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listProject(id) {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: id,
            },
        });

        if (project) {
            return {
                type: 'success',
                message: 'Listagem de projeto bem-sucedida.',
                data: project,
            };
        } else {
            return {
                type: 'error',
                message: 'Projeto não existente.',
            };
        }
    } catch (error) {
        console.error("Erro ao listar projeto:", error);
        throw error;
    }
}

async function listAllProject() {
    try {
        const project = await prisma.user.findMany();

        if (project.length > 0) {
            return {
                type: 'success',
                message: 'Listagem de projetos bem-sucedida.',
                data: project,
            };
        } else {
            return {
                type: 'error',
                message: 'Nenhuma projeto encontrado.',
            };
        }
    } catch (error) {
        console.error("Erro ao listar projetos:", error);
        throw error;
    }
}

async function updateProject(id, data) {
  try {
      const existingProject = await prisma.project.findUnique({
          where: { id },
      });

      if (!existingProject) {
          return {
              type: 'error',
              message: 'Projeto não encontrada para edição.',
          };
      }

      const updatedProject = await prisma.project.update({
          where: { id },
          data: {
              title: data.title || existingProject.title,
              updatedAt: new Date(),
              imageUrl: data.imageUrl !== undefined ? data.imageUrl : existingProject.imageUrl,
              content: data.content || existingProject.content,
              theme: data.theme || existingProject.theme,
              status: data.status || existingProject.status,
              description: data.description || existingProject.description,
          },
      });

      return {
          type: 'success',
          message: 'Projeto editada com sucesso.',
          data: updatedProject,
      };
  } catch (error) {
      console.error("Erro ao editar projeto:", error.message);
      return {
          type: 'error',
          message: 'Erro ao editar o projeto.',
          error: error.message,
      };
  }
}

async function createProject(data) {
    try {
        const newProject = await prisma.project.create({
            data: {
                id: data.id,
                theme: data.theme,
                title: data.title,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                status: data.status,
                imageUrl: [...data.imageUrl],
                description: data.description,
            },
        });

        return {
            type: 'success',
            message: 'Projeto criado com sucesso.',
            data: newProject,
        };
    } catch (error) {
        console.error("Erro ao criar projeto:", error);
        throw error;
    }
}

async function deleteProject(id) {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: id,
            },
        });

        if (!project) {
            return {
                type: 'error',
                message: 'Projeto não encontrado para deletar.',
            };
        }

        await prisma.project.delete({
            where: {
                id: id,
            },
        });

        return {
            type: 'success',
            message: 'Projeto deletado com sucesso.',
        };
    } catch (error) {
        console.error("Erro ao deletar projeto:", error);
        throw error;
    }
}

module.exports = {
    listProject,
    listAllProject,
    deleteProject,
    createProject,
    updateProject
};
