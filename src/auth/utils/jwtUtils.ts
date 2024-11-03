const jwt = require('jsonwebtoken');

function generateJWT(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function verifyJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

module.exports = {
    generateJWT,
    verifyJWT,
};
