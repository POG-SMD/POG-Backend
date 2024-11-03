const express = require('express');
require('../controllers/loginController');
require('../auth/middlewares/authenticateJWT');

const router = express.Router();

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

router.post('/register', async (req, res) => {
    try {
        const result = await createUser(req.body);
        if (result.type === 'success') {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

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
