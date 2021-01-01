const express = require('express');
const app = express();
const paths = require('./webpack/paths');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// serve application
app.use(express.static(paths.build));
app.get('*', (_, res) => res.sendFile(paths.build));

const PORT = process.env.PORT || 3000;

// collaboration
// create players object
const players = {};

io.on('connection', socket => {
  // send all peers to new player
  socket.emit('peers', players);

  // create new player
  console.log('A player connected: ' + socket.id);
  players[socket.id] = {
    id: socket.id,
    x: 21 * Object.values(players).length,
    y: 525
  };

  // send player to newly connected user
  socket.emit('player-connected', players[socket.id]);

  // notify all players of connection
  socket.broadcast.emit('peer-connected', players[socket.id]);

  socket.on('disconnect', () => {
    // notify all players of disconnection
    socket.broadcast.emit('peer-disconnected', players[socket.id]);

    console.log('A player disconnected: ' + socket.id);
    // delete player
    delete players[socket.id];
  });

  // player updated
  socket.on('player-updated', player => {
    socket.broadcast.emit('player-updated', player);
  });
});

http.listen(PORT, function () {
  console.log('Server started!');
});
