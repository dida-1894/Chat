const express = require('express')
const path = require('path')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const socket = require('./lobby')

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3100",
      credentials: true
    }
});

if (process.env.NODE_ENV != 'development') {
  app.use(express.static(__dirname + '/../dist'));
  app.get('*', (_,res) =>{
    res.sendFile(path.join(__dirname+'/../dist/index.html'));
  })
}

io.on('connection', s => socket(s, io));

server.listen(3200, () => {
  console.log('listening on *:3200');
});