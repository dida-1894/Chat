const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const socket = require('./room')

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3100",
      credentials: true
    }
});

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

io.on('connection', socket);

server.listen(3200, () => {
  console.log('listening on *:3200');
});