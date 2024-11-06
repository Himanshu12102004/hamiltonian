class Socket {
  constructor(
    server,
    options = {
      cors: {
        origin: "*",
      },
    }
  ) {
    this.io = require("socket.io")(server, options);

    this.io.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
  }
  checkConnection() {
    return this.io.engine.clientsCount;
  }
  sendMessage(event, message) {
    if (this.checkConnection() === 0) {
      console.log("No user connected");
      return;
    }
    this.io.emit(event, message);
  }
}

let socketInstance;

function initializeSocket(server) {
  socketInstance = new Socket(server);
}

function getSocketInstance() {
  if (!socketInstance) {
    throw new Error("Socket is not initialized. Call initializeSocket first.");
  }
  return socketInstance;
}

module.exports = { initializeSocket, getSocketInstance };
