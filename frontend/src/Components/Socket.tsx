import { io, Socket } from 'socket.io-client';

let socket: Socket | undefined;

const initializeSocket = (): Socket => {
  socket = io(process.env.BACKEND_URL, {
    autoConnect: false,
  });
  // when connection is established, log the connection id
  socket.on('connect', () => {
    console.log(socket?.id);
  });

  return socket;
};

const getSocket = (): Socket | undefined => socket;

export { initializeSocket, getSocket };
