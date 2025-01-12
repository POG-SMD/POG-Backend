const express = require("express");
const {
  updateReserva,
  deleteReserva,
  createReserva,
  listReserva,
  listAllReserva,
} = require("../../../controllers/admin/reservationController");
const authenticateJWT = require("../../../auth/middlewares/authenticateJWT");

const router = express.Router();

router.get("/all", authenticateJWT, async (req, res) => {
  try {
    const result = await listAllReserva();
    if (result.type === "success") return res.status(200).send(result);
    return res.status(400).send(result);
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await listReserva(Number(req.params.id));
    if (result.type === "success") return res.status(200).send(result);
    return res.status(400).send(result);
  } catch (error) {
    console.error("Erro ao listar reserva:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

router.post("/create", authenticateJWT, async (req, res) => {
  try {
    const result = await createReserva(req.body);
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

router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await deleteReserva(Number(req.params.id));
    if (result.type === "success") return res.status(200).send(result);
    return res.status(400).send(result);
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});


router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const result = await updateReserva(Number(req.params.id), req.body);
    if (result.type === "success") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Erro ao editar reserva:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
