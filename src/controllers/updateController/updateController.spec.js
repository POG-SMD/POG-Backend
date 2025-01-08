const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const app = require('../../server');
const { loginUser } = require('../loginController');

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

describe('Testes do Controller de Update', () => {

    it('Deve fazer login com sucesso', async () => {
        const password = 'SenhaSegur@';

        const credentials = {
            email: 'adm@example.com',
            password: password,
        };

        const response = await loginUser(credentials.email, credentials.password);
        expect(response.type).toBe('success');
        expect(response.message).toBe('Login bem-sucedido.');
        expect(response.token).toBeDefined(); 
    });

    it('Deve conseguir trocar a role com sucesso', async () => {
        const loginResponse = await loginUser('adm@example.com', 'SenhaSegur@');
        expect(loginResponse.type).toBe('success');
        const token = loginResponse.token;

        const updateResponse = await request(app)
            .put('/api/v1/update') 
            .set('Authorization', `Bearer ${token}`)
            .send({
                userEmail: 'user@example.com',
                newRole: 'USER',
            });

        expect(updateResponse.status).toBe(200); 
        expect(updateResponse.body.type).toBe('success');
        expect(updateResponse.body.message).toBe('Update de função do usuário bem-sucedido.');

        const user = await prisma.user.findUnique({
            where: { email: 'user@example.com' },
        });
        expect(user.role).toBe('USER'); 
    });
});
