const express = require("express");
const {
  updateMaterial,
  deleteMaterial,
  createMaterial,
  listMaterial,
  listAllMaterial,
} = require("../../../controllers/admin/materialController");
const authenticateJWT = require("../../../auth/middlewares/authenticateJWT");

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/materials/all:
 *   get:
 *     summary: Lista todos os materiais
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de materiais retornada com sucesso
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
 *                   type:
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
    const result = await listAllMaterial();
    if (result.type === "success") return res.status(200).send(result);
    return res.status(400).send(result);
  } catch (error) {
    console.error("Erro ao listar materiais:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/materials/{id}:
 *   get:
 *     summary: Lista um material pelo ID
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
 *         description: Material retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 type:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Material não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await listMaterial(Number(req.params.id));
    if (result.type === "success") return res.status(200).send(result);
    return res.status(400).send(result);
  } catch (error) {
    console.error("Erro ao listar material:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/materials/create:
 *   post:
 *     summary: Cria um novo material
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - type
 *     responses:
 *       200:
 *         description: Material criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Material criado com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     type:
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
    const result = await createMaterial(req.body);
    if (result.type === "success") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Erro ao criar material:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/materials/{id}:
 *   delete:
 *     summary: Deleta um material pelo ID
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
 *         description: Material deletado com sucesso
 *       400:
 *         description: Material não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await deleteMaterial(Number(req.params.id));
    if (result.type === "success") return res.status(200).send(result);
    return res.status(400).send(result);
  } catch (error) {
    console.error("Erro ao deletar material:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/materials/{id}:
 *   put:
 *     summary: Atualiza um material pelo ID
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
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Material atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Material editado com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     type:
 *                       type: string
 *                     description:
 *                       type: string
 *       400:
 *         description: Material não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await updateMaterial(Number(req.params.id), req.body);
    if (result.type === "success") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Erro ao editar material:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
