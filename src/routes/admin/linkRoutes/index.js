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
