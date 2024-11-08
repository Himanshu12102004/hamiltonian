const app = require('./app');
const { initializeSocket } = require('./WebSockets/socket');

const PORT = process.env.PORT || 5000;
const IP = process.env.IP || 'localhost';

const server = app.listen(PORT,() => {
  console.log(`Server running on http://${IP}:${PORT}`);
  console.log(`✅ Server started successfully!`);
  console.log(`🛑 Press Ctrl + C to stop the server`);
  if (process.env.NODE_ENV === "production")
    console.log(`🚀 Open the browser and go to http://${IP}:${PORT}`);
  else console.log(`🛜 Use http://${IP}:${PORT} to access the server`);
});

initializeSocket(server);
