const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateUserRole(userEmail, newRole) {
    try {
        const validRoles = ["USER", "ADM"];
        
        if (!validRoles.includes(newRole)) {
            return {
                type: 'error',
                message: 'Role não existente',
            };
        }

        const userExists = await prisma.user.findUnique({
            where: { 
                email: userEmail,
            },
        });

        if (!userExists) {
            return {
                type: 'error',
                message: 'Usuário não existente',
            };
        }

        const updateRole = await prisma.user.update({
            where: { email: userEmail },
            data: { role: newRole },
        });

        return {
            type: 'success',
            message: 'Função do usuário atualizada com sucesso',
            data: updateRole,
        };

    } catch (error) {
        console.error("Erro ao atualizar a função do usuário:", error);
        return {
            type: 'error',
            message: 'Erro ao atualizar a função do usuário',
        };
    }
}

module.exports = updateUserRole;
