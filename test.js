import http from 'http';

const host = 'localhost';
const port = 3000;

const server = http
  .createServer(async (req, res) => {
    console.log(req);
    res.writeHead(200);
    res.end("Response")
  })
  .listen(port, host, () => {
    console.log(`Server is running on: http://${host}:${port}`);
  });