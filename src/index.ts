const server = require('./src/server.js');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3000;

server.listen(port, () => {
    if (process.env.NODE_ENV !== 'development') console.log(process.env.NODE_ENV);
    console.log(`Server aberto em http://localhost:${port}/`);
});