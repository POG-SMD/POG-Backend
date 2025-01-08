const express = require('express');
const { updateProject, deleteProject, createProject, listProject, listAllProject } = require('../../../controllers/admin/projectController');

const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const result = await listAllProject();
        if (result.type === 'success') return res.status(200).send(result);
        return res.status(400).send(result);

    } catch (error) {
        console.error("Erro ao listar projetos:", error);
        return res.status(500).send({ error: 'Erro interno do servidor' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await listProject(Number(req.params.id));
        if (result.type === 'success') return res.status(200).send(result);
        return res.status(400).send(result);

    } catch (error) {
        console.error("Erro ao listar projeto:", error);
        return res.status(500).send({ error: 'Erro interno do servidor' });
    }
});

router.post('/create', async (req, res) => {
    try {
        const result = await createProject(req.body);
        if (result.type === 'success') {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Erro ao criar projeto:", error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await deleteProject(Number(req.params.id));
        if (result.type === 'success') return res.status(200).send(result);
        return res.status(400).send(result);

    } catch (error) {
        console.error("Erro ao deletar projeto:", error);
        return res.status(500).send({ error: 'Erro interno do servidor' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const result = await updateProject(Number(req.params.id), req.body);
        if (result.type === 'success') {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Erro ao editar projeto:", error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
