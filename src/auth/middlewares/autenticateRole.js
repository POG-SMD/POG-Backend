const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function authenticateRole(userAdmEmail) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: userAdmEmail
            }
        });

        if (user && user.role === 'ADM') return true;
        return false;

    } catch (err) {
        console.error('Erro autenticando usuário:', err);
        throw err;
    }
}

module.exports = authenticateRole;