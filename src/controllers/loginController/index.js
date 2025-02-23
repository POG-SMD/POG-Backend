const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwtUtils = require("../../auth/utils/jwtUtils");
const validatePassword = require("../../shared/utils/validation/passwordValidation");

const prisma = new PrismaClient();

async function listUser(id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user) {
      return {
        type: "success",
        message: "Listagem de usuário bem-sucedida.",
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } else {
      return {
        type: "error",
        message: "Usuário não existente.",
      };
    }
  } catch (error) {
    console.error("Erro ao listar usuário:", error);
    throw error;
  }
}

async function listAllUsers() {
  try {
    const users = await prisma.user.findMany();

    if (users.length) {
      return {
        type: "success",
        message: "Listagem de usuários bem-sucedida.",
        data: users,
      };
    } else {
      return {
        type: "error",
        message: "Nenhum usuário encontrado.",
      };
    }
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    throw error;
  }
}

async function createUser(data) {
  try {
    const passwordValidation = await validatePassword(data.password);

    if (!passwordValidation.valid) {
      return {
        type: "error",
        message: passwordValidation.error,
        suggestion: passwordValidation.suggestion,
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return {
        type: "error",
        message: "O e-mail já está em uso. Por favor, use outro e-mail.",
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
      },
    });

    return {
      type: "success",
      message: "Usuário criado com sucesso.",
      data: newUser,
    };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
}

async function deleteUser(id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return {
        type: "error",
        message: "Usuário não encontrado para deletar.",
      };
    }

    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return {
      type: "success",
      message: "Usuário deletado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        type: "error",
        message: "Usuário não encontrado.",
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        type: "error",
        message: "Senha incorreta.",
      };
    }

    const token = jwtUtils.generateJWT({ userId: user.id });

    return {
      type: "success",
      message: "Login bem-sucedido.",
      token: token,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}

module.exports = {
  listUser,
  listAllUsers,
  createUser,
  deleteUser,
  loginUser,
};
