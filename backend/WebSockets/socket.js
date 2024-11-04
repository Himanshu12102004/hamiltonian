let globalSocket = null;

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

    globalSocket = this;
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

module.exports = { Socket, globalSocket };
