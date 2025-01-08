const express = require('express');
const { updateUserController } = require('../../controllers/updateController');
const authenticateJWT = require('../../auth/middlewares/authenticateJWT');

const router = express.Router();

router.put('/', authenticateJWT, async (req, res) => {
    try {
        const result = await updateUserController(req.body);
        if (result.type === 'success') return res.status(200).send(result);
        return res.status(400).send(result);

    } catch (error) {
        console.error("Erro ao dar update na função do usuário:", error);
        return res.status(500).send({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
