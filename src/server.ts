require('express');
const app = express();
const limiter = require('./shared/middlewares/rateLimit');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

const loginRoutes = require('./routes/loginRoutes');
const updateRoutes = require('./routes/updateRoutes');

app.use('/api/v1/login', loginRoutes);
app.use('/api/v1/update', updateRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erro interno do servidor');
});

module.exports = app;