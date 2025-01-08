const request = require('supertest');
const app = require('../../server'); 

describe('Testes das Rotas de Login', () => {

    // Trocar cada vez que for fazer o teste o ID
    const idAtual = 8;
    
    it('Deve criar um novo usuário com status 200', async () => {
        const newUser = {
            email: 'novousuario@example.com',
            password: 'SenhaFort3@',
            name: 'Novo Usuário'
        };
        const response = await request(app)
            .post('/api/v1/login')
            .send(newUser);
        expect(response.status).toBe(200);
        expect(response.body.type).toBe('success');
    });

    it('Deve retornar todos os usuários com status 200', async () => {
        const response = await request(app).get('/api/v1/login/all');
        expect(response.status).toBe(200);
        expect(response.body.type).toBe('success');
    });

    it('Deve retornar um usuário específico com status 200', async () => {
        const response = await request(app).get(`/api/v1/login/${idAtual}`);
        expect(response.status).toBe(200);
        expect(response.body.type).toBe('success');
    });

    it('Deve fazer login com sucesso com status 200', async () => {
        const credentials = {
            email: 'novousuario@example.com',
            password: 'SenhaFort3@'
        };
        const response = await request(app)
            .post('/api/v1/login/login')
            .send(credentials);
        expect(response.status).toBe(200);
        expect(response.body.type).toBe('success');
    });

    it('Deve retornar status 400 ao tentar fazer login com credenciais inválidas', async () => {
        const invalidCredentials = {
            email: 'usuario@teste.com',
            password: 'senhaerrada'
        };
        const response = await request(app)
            .post('/api/v1/login/login')
            .send(invalidCredentials);
        expect(response.status).toBe(400);
        expect(response.body.type).toBe('error');
    });

    it('Deve deletar um usuário existente com status 200', async () => {
        const response = await request(app).delete(`/api/v1/login/${idAtual}`);
        expect(response.status).toBe(200);
        expect(response.body.type).toBe('success');
    });

    it('Deve retornar status 400 ao tentar criar usuário com dados inválidos', async () => {
        const invalidUser = {
            email: 'emailinvalido', 
            password: 'weak',
            name: 'Usuário Inválido'
        };
        const response = await request(app)
            .post('/api/v1/login')
            .send(invalidUser);
        expect(response.status).toBe(400);
        expect(response.body.type).toBe('error');
    });
});
