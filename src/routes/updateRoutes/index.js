const express = require('express');
const { updateUserController } = require('../../controllers/updateController');
const authenticateJWT = require('../../auth/middlewares/authenticateJWT');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserRequest:
 *       type: object
 *       required:
 *         - userAdmEmail
 *         - userEmail
 *         - newRole
 *       properties:
 *         userAdmEmail:
 *           type: string
 *           description: Email do usuário administrador que está realizando a atualização.
 *         userEmail:
 *           type: string
 *           description: Email do usuário cuja função será atualizada.
 *         newRole:
 *           type: string
 *           description: Nova função que será atribuída ao usuário.
 *     UpdateUserResponse:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: Tipo da resposta (success ou error).
 *         message:
 *           type: string
 *           description: Mensagem explicativa do status da operação.
 *         data:
 *           type: object
 *           description: Dados adicionais de resposta.
 *           example: {}
 *       required:
 *         - type
 *         - message
 *         - data
 */

/**
 * @swagger
 * /update:
 *   put:
 *     summary: Atualiza a função de um usuário.
 *     description: Permite a atualização da função de um usuário por um administrador autenticado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Função do usuário atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       400:
 *         description: Erro de validação ou falha ao atualizar a função do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro.
 *                   example: 'Erro interno do servidor'
 */

/**
 * Rota para atualizar a função de um usuário.
 */
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
