import { io } from "socket.io-client";

// const URL = "https://simpaticone-backend.onrender.com";
const URL = "localhost:3000";

export const socket = io(URL);
