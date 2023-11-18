const http = require('http');
const url = require('url');
const uuidv4 = require('uuid').v4;
const { WebSocketServer } = require('ws');

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const PORT = 8000;

const connections = {};
const users = {};

const broadcast = () => {
  const payload = JSON.stringify(users);
  Object.values(connections).forEach((conn) => conn.send(payload));
};
const handleMessage = (uuid, bytes) => {
  const user = users[uuid];
  user.state = JSON.parse(bytes.toString());
  console.log(
    `Received message from ${user.username} (${uuid}):`,
    users[uuid].state
  );
  broadcast();
};

/**
 * Connect to the server using the following URL:
 * ws://localhost:8000?username=Alex
 */
wsServer.on('connection', (conn, req) => {
  const { username } = url.parse(req.url, true).query;

  const uuid = uuidv4();
  console.log(`User ${username} (${uuid}) connected`);

  connections[uuid] = conn;
  users[uuid] = {
    username,
    state: {},
  };

  conn.on('message', (message) => handleMessage(uuid, message));
});

/**
 * Set up Http server to listen for incoming requests.
 */
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
