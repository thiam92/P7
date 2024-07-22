// server.js
const http = require('http');
const app = require('./app'); // Importer l'application Express

const port = process.env.PORT || 3000; // Définir le port

const server = http.createServer(app);

server.listen(port, () => {
console.log(`Server running on port ${port}`);
});