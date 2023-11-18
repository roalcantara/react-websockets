const http = require('http');
const url = require('url');
const { WebSocketServer } = require('ws');

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const PORT = 8000;

// ws://localhost:8000?username=Alex
wsServer.on('connection', (conn, req) => {
  const { username } = url.parse(req.url, true).query;
  console.log(`User ${username} connected`);
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
