const express = require('express');
const { createUser, deleteUser, listAllUsers, listUser, loginUser } = require('../../controllers/loginController');
const authenticateJWT = require('../../auth/middlewares/authenticateJWT');

const router = express.Router();

/**
 * @swagger
 * /api/v1/login/all:
 *   get:
 *     summary: Lista todos os usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/all', authenticateJWT, async (req, res) => {
    try {
        const result = await listAllUsers();
        if (result.type === 'success') return res.status(200).send(result);
        return res.status(400).send(result);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        return res.status(500).send({ error: 'Erro interno do servidor' });
    }
});

/**
 * @swagger
 * /api/v1/login/{id}:
 *   get:
 *     summary: Lista um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const result = await listUser(Number(req.params.id));
        if (result.type === 'success') return res.status(200).send(result);
        return res.status(400).send(result);
    } catch (error) {
        console.error("Erro ao listar usuário:", error);
        return res.status(500).send({ error: 'Erro interno do servidor' });
    }
});

/**
 * @swagger
 * /api/v1/login/register:
 *   post:
 *     summary: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', async (req, res) => {
    try {
        const result = await createUser(req.body);
        if (result.type === 'success') return res.status(200).json(result);
        return res.status(400).json(result);
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

/**
 * @swagger
 * /api/v1/login/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       400:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const result = await deleteUser(Number(req.params.id));
        if (result.type === 'success') return res.status(200).send(result);
        return res.status(400).send(result);
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return res.status(500).send({ error: 'Erro interno do servidor' });
    }
});

/**
 * @swagger
 * /api/v1/login/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     description: Autentica o usuário com email e senha, retornando um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login bem-sucedido."
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Senha incorreta."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser(email, password);

        if (result.type === 'success') {
            return res.status(200).json({ message: result.message, token: result.token });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
