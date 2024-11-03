const  rateLimit = require("express-rate-limit");

const limit = rateLimit({
    // Permite 100 requisições a cada 10min (só é necessário trocar o primeiro valor para trocar os minutos)
    windowMs: 10 * 60 * 1000,
    max: 50,
    message: 'Limite de requisições excedido, por favor, tente novamente mais tarde.'
});

module.exports = limit;