const http = require('http');
const server = http.createServer();
const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
