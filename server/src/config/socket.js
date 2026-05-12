const { Server } = require('socket.io');
const env = require('./env');

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('match:join', (matchId) => {
      socket.join(`match:${matchId}`);
    });

    socket.on('match:leave', (matchId) => {
      socket.leave(`match:${matchId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initSocket;
