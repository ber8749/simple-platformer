// create server
const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);

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

http.listen(3000, function () {
  console.log('Server started!');
});