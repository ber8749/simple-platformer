// create server
const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);

// create players object
const players = {};

io.on('connection', socket => {
  // send all players to new player
  socket.emit('players', players);

  // create new player
  console.log('A player connected: ' + socket.id);
  players[socket.id] = {
    id: socket.id,
    x: 21 * Object.values(players).length,
    y: 525
  };

  // send new player to new player
  socket.emit('player', players[socket.id]);

  // notify all players of connection
  socket.broadcast.emit('player-connected', players[socket.id]);

  socket.on('disconnect', () => {
    // notify all players of disconnection
    socket.broadcast.emit('player-disconnected', players[socket.id]);

    console.log('A player disconnected: ' + socket.id);
    // delete player
    delete players[socket.id];
  });
});

http.listen(3000, function () {
  console.log('Server started!');
});
