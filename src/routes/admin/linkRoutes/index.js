const express = require("express");
const {
  updateLink,
  deleteLink,
  createLink,
  listLink,
  listAllLink,
} = require("../../../controllers/admin/linkController");
const authenticateJWT = require("../../../auth/middlewares/authenticateJWT");

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/links/all:
 *   get:
 *     summary: Lista todos os links
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de links retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   link:
 *                     type: string
 *                   description:
 *                     type: string
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/all", authenticateJWT, async (req, res) => {
  try {
    const result = await listAllLink();
    if (result.type === "success") return res.status(200).send(result);
    return res.status(400).send(result);
  } catch (error) {
    console.error("Erro ao listar links:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/links/{id}:
 *   get:
 *     summary: Lista um link pelo ID
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
 *         description: Link retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 link:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Link não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await listLink(Number(req.params.id));
    if (result.type === "success") return res.status(200).send(result);
    return res.status(400).send(result);
  } catch (error) {
    console.error("Erro ao listar link:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/links/create:
 *   post:
 *     summary: Cria um novo link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               link:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - link
 *     responses:
 *       200:
 *         description: Link criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Link criado com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     link:
 *                       type: string
 *                     description:
 *                       type: string
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/create", authenticateJWT, async (req, res) => {
  try {
    const result = await createLink(req.body);
    if (result.type === "success") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Erro ao criar link:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/links/{id}:
 *   delete:
 *     summary: Deleta um link pelo ID
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
 *         description: Link deletado com sucesso
 *       400:
 *         description: Link não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await deleteLink(Number(req.params.id));
    if (result.type === "success") return res.status(200).send(result);
    return res.status(400).send(result);
  } catch (error) {
    console.error("Erro ao deletar link:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/links/{id}:
 *   put:
 *     summary: Atualiza um link pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               link:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Link atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Link editada com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     link:
 *                       type: string
 *                     description:
 *                       type: string
 *       400:
 *         description: Link não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await updateLink(Number(req.params.id), req.body);
    if (result.type === "success") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Erro ao editar link:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
