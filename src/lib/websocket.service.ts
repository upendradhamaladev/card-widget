import io, { Socket } from "socket.io-client";

const socket: Socket = io(`${process.env.REACT_APP_DB_HOST}` || "", {
  transports: ["websocket"],
});

export const initializeSocket = async () => {
  try {
    // await /()
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected"); // false
    });
    socket.on("error", (error: any) => {
      console.log("socket error", error);
      if (error.message === "AuthenticationError") {
        console.log("re-authenticate");
      }
    });
  } catch (error) {
    socket.on("error", (message) => {
      console.log("error from socket", message);
    });
  }
};

export const disconnectSocket = () => {
  console.log("Disconnecting from WebSocket server...");
  socket.disconnect();
};

export default socket;
