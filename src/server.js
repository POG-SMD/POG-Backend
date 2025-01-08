const express = require('express');
const app = express();
const limiter = require('./shared/middlewares/rateLimit');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

const loginRoutes = require('./routes/loginRoutes');
const updateRoutes = require('./routes/updateRoutes');
const linkRoutes = require('./routes/admin/linkRoutes');
const materialRoutes = require('./routes/admin/materialRoutes');

app.use('/api/v1/login', loginRoutes);
app.use('/api/v1/update', updateRoutes);
app.use('/api/v1/material', materialRoutes);
app.use('/api/v1/link', linkRoutes);

app.use((err, _, res) => {
    console.error(err.stack);
    res.status(500).send('Erro interno do servidor');
});

module.exports = app;