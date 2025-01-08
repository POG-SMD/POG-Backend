const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const app = require('../../server'); 
const { loginUser } = require('../../controllers/loginController');

const prisma = new PrismaClient();

async function clearDatabase() {
    await prisma.user.deleteMany();
}

beforeEach(async () => {
    await clearDatabase();

    const hashedPassword = await bcrypt.hash('SenhaSegur@', 10);
    await prisma.user.create({
        data: {
            email: 'adm@example.com',
            password: hashedPassword,
            role: 'ADM',
            name: 'ADM_TESTE'
        },
    });

    await prisma.user.create({
        data: {
            email: 'user@example.com',
            password: hashedPassword,
            role: 'USER',
            name: 'USER_TESTE'
        },
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Rotas de update', () => {

    it('Deve fazer update com sucesso com status 200', async () => {
        const loginResponse = await loginUser('adm@example.com', 'SenhaSegur@');
        expect(loginResponse.type).toBe('success');
        const token = loginResponse.token;

        const updateData = {
            userEmail: 'user@example.com',
            newRole: 'USER' 
        };

        const response = await request(app)
            .put('/api/v1/update')
            .set('Authorization', `Bearer ${token}`) 
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.type).toBe('success');
        expect(response.body.message).toBe('Update de função do usuário bem-sucedido.');

        const user = await prisma.user.findUnique({
            where: { email: 'user@example.com' },
        });
        expect(user.role).toBe('USER');
    });
});