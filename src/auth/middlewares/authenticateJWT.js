const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido. Acesso não autorizado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Falha na autenticação do token.' });
        }
        req.user = decoded;
        next(); 
    });
}

module.exports = authenticateJWT;
