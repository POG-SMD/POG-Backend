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

router.get("/all", authenticateJWT, async (req, res) => {
  try {
    const result = await listAllMaterial();
    if (result.type === "success") return res.status(200).send(result);
    return res.status(400).send(result);
  } catch (error) {
    console.error("Erro ao listar materials:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
});

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
