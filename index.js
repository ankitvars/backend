const connectToMongo = require('./db');
const express = require('express');
const app = express();
const http = require('http');
const port = 7000;
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.json());
app.use('/api', require('./routes/authroute'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

connectToMongo();
