const app = require("./app");
const { initializeSocket } = require("./WebSockets/socket");

const PORT = process.env.PORT || 5000;
const IP = process.env.IP || "localhost";

const server = app.listen(PORT, IP, () => {
  console.log(`Server running on http://${IP}:${PORT}`);
});

initializeSocket(server);
