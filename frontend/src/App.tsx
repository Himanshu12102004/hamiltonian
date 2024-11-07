import { useEffect } from "react";
import "./App.css";

import CanvasParent from "./Components/CanvasParent";
import Layout from "./Components/Layout";
import { initializeSocket, getSocket } from "./Components/Socket.js";

function App(): JSX.Element {
  initializeSocket();
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.connect();
    }
  }, []);
  return (
    <Layout>
      <CanvasParent></CanvasParent>
    </Layout>
  );
}
export default App;
