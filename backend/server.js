const app = require("./app");
const { Socket } = require("./WebSockets/socket");

const PORT = process.env.PORT || 5000;
const IP = process.env.IP || "localhost";

const server = app.listen(PORT, IP, () => {
  console.log(`Server running on http://${IP}:${PORT}`);
});

new Socket(server);
