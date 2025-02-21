const express = require("express");
const {
  listAllReservations,
  listReservation,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../../controllers/reservationController");
const authenticateJWT = require("../../auth/middlewares/authenticateJWT");

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/reservations/all:
 *   get:
 *     summary: Lista todas as reservas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/all", authenticateJWT, async (req, res) => {
  try {
    const result = await listAllReservations();
    return res.status(result.type === "success" ? 200 : 400).send(result);
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/reservations/{id}:
 *   get:
 *     summary: Lista uma reserva pelo ID
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
 *         description: Reserva retornada com sucesso
 *       400:
 *         description: Reserva não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await listReservation(Number(req.params.id));
    return res.status(result.type === "success" ? 200 : 400).send(result);
  } catch (error) {
    console.error("Erro ao listar reserva:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/reservations/create:
 *   post:
 *     summary: Cria uma nova reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               materialId:
 *                 type: integer
 *               type:
 *                 type: integer
 *               purpose:
 *                 type: string
 *             required:
 *               - userId
 *               - materialId
 *               - type
 *               - purpose
 *     responses:
 *       200:
 *         description: Reserva criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/create", authenticateJWT, async (req, res) => {
  try {
    const result = await createReservation(req.body);
    if (result.type === "success") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/reservations/{id}:
 *   put:
 *     summary: Atualiza uma reserva pelo ID
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
 *               type:
 *                 type: integer
 *               purpose:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reserva atualizada com sucesso
 *       400:
 *         description: Reserva não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await updateReservation(Number(req.params.id), req.body);
    return res.status(result.type === "success" ? 200 : 400).json(result);
  } catch (error) {
    console.error("Erro ao editar reserva:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /api/v1/admin/reservations/{id}:
 *   delete:
 *     summary: Deleta uma reserva pelo ID
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
 *         description: Reserva deletada com sucesso
 *       400:
 *         description: Reserva não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await deleteReservation(Number(req.params.id));
    return res.status(result.type === "success" ? 200 : 400).send(result);
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
