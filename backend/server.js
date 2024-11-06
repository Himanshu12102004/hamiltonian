const app = require("./app");

const PORT = process.env.PORT || 5000;
const IP = process.env.IP || "localhost";

app.listen(PORT, IP, () => {
  console.log(`Server running on http://${IP}:${PORT}`);
});
