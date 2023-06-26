import { io } from "socket.io-client";

const URL = "https://simpaticone-backend.onrender.com";

export const socket = io(URL);
