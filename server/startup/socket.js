module.exports = function (app, port) {
  const server = require('http').createServer(app);
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:5000'
    }
  });

  io.newMove = newMove;
  io.player2HasJoined = player2HasJoined;
  io.gameEnded = gameEnded;

  io.on('connection', client => {
    console.log("NEW socket connection")
    client.on('event', data => { /* … */ });
    client.on('disconnect', reason => { console.log('disconnected for reason: ', reason); });
  });

  server.listen(port, err=> {
    if(err) console.log(err);
    console.log('Server running on port:', port);
  })

  app.set('socket', io);
}

function newMove(move){
  this.emit("newMove", move);
}

function player2HasJoined(player2){
  this.emit("player2HasJoined", player2);
}

function gameEnded(winner){
  this.emit("gameEnded", winner);
}