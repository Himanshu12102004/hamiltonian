import { io } from "socket.io-client";

let socket;

const initializeSocket = () => {
  socket = io("http://localhost:5000", {
    autoConnect: false,
  });
  // when connection is established, log the connection id
  socket.on("connect", () => {
    console.log(socket.id);
  });

  return socket;
};

const getSocket = () => socket;

export { initializeSocket, getSocket };
