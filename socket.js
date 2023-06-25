import { io } from "socket.io-client";

const URL =
  import.meta.env.VITE_ENV === "pro"
    ? import.meta.env.VITE_URL
    : "http://localhost:3000";

export const socket = io(URL);
