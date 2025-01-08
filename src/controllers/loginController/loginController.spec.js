const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { listUser, listAllUsers, createUser, deleteUser, loginUser } = require('./index');

const prisma = new PrismaClient();

async function clearDatabase() {
    await prisma.user.deleteMany();
}

beforeEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Testes do Controller de Login', () => {
    it('Deve listar um usuário existente', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'testuser@example.com',
                password: await bcrypt.hash('Password1@', 10),
                name: 'Test User',
            },
        });

        const response = await listUser(user.id);
        expect(response.type).toBe('success');
        expect(response.message).toBe('Listagem de usuário bem-sucedida.');
        expect(response.data.id).toBe(user.id);
    });

    it('Deve retornar erro ao listar usuário inexistente', async () => {
        const response = await listUser(999); // ID não existente
        expect(response.type).toBe('error');
        expect(response.message).toBe('Usuário não existente.');
    });

    it('Deve listar todos os usuários', async () => {
        const user1 = await prisma.user.create({
            data: {
                email: 'user1@example.com',
                password: await bcrypt.hash('Password1@', 10),
                name: 'User 1',
            },
        });

        const user2 = await prisma.user.create({
            data: {
                email: 'user2@example.com',
                password: await bcrypt.hash('Password2@', 10),
                name: 'User 2',
            },
        });

        const response = await listAllUsers();
        expect(response.type).toBe('success');
        expect(response.message).toBe('Listagem de usuários bem-sucedida.');
        expect(response.data).toHaveLength(2);
        expect(response.data.map(user => user.id)).toContain(user1.id);
        expect(response.data.map(user => user.id)).toContain(user2.id);
    });

    it('Deve criar um novo usuário', async () => {
        const newUser = {
            email: 'novousuario@example.com',
            password: 'SenhaFort3@',
            name: 'Novo Usuário',
        };

        const response = await createUser(newUser);
        expect(response.type).toBe('success');
        expect(response.message).toBe('Usuário criado com sucesso.');
        expect(response.data.email).toBe(newUser.email);

        const createdUser = await prisma.user.findUnique({
            where: { email: newUser.email },
        });
        expect(createdUser).toBeDefined();
        expect(await bcrypt.compare(newUser.password, createdUser.password)).toBeTruthy();
    });

    it('Deve retornar erro ao criar usuário com senha inválida', async () => {
        const invalidUser = {
            email: 'novousuario@example.com',
            password: 'weak',
            name: 'Usuário Inválido',
        };

        const response = await createUser(invalidUser);
        expect(response.type).toBe('error');
        expect(response.message).toContain('Erro na validação de senha');
    });

    it('Deve deletar um usuário existente', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'testuser@example.com',
                password: await bcrypt.hash('Password1@', 10),
                name: 'Test User',
            },
        });

        const response = await deleteUser(user.id);
        expect(response.type).toBe('success');
        expect(response.message).toBe('Usuário deletado com sucesso.');

        const deletedUser = await prisma.user.findUnique({
            where: { id: user.id },
        });
        expect(deletedUser).toBeNull();
    });

    it('Deve retornar erro ao deletar usuário inexistente', async () => {
        const response = await deleteUser(999); // ID não existente
        expect(response.type).toBe('error');
        expect(response.message).toBe('Usuário não encontrado para deletar.');
    });

    it('Deve fazer login com sucesso', async () => {
        const password = 'SenhaSegur@';
        const user = await prisma.user.create({
            data: {
                email: 'usuario@teste.com',
                password: await bcrypt.hash(password, 10),
                name: 'Usuário de Teste',
            },
        });

        const credentials = {
            email: 'usuario@teste.com',
            password: password,
        };

        const response = await loginUser(credentials.email, credentials.password);
        expect(response.type).toBe('success');
        expect(response.message).toBe('Login bem-sucedido.');
    });

    it('Deve retornar erro ao fazer login com senha incorreta', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'usuario@teste.com',
                password: await bcrypt.hash('SenhaSegur@', 10),
                name: 'Usuário de Teste',
            },
        });

        const credentials = {
            email: 'usuario@teste.com',
            password: 'senhaerrada',
        };

        const response = await loginUser(credentials.email, credentials.password);
        expect(response.type).toBe('error');
        expect(response.message).toBe('Senha incorreta.');
    });

    it('Deve retornar erro ao fazer login com usuário inexistente', async () => {
        const credentials = {
            email: 'usuario@inexistente.com',
            password: 'SenhaQualquer@',
        };

        const response = await loginUser(credentials.email, credentials.password);
        expect(response.type).toBe('error');
        expect(response.message).toBe('Usuário não encontrado.');
    });
});