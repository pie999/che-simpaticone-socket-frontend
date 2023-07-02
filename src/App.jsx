import "./App.css";
import { useState, useEffect } from "react";
import { socket } from "../socket";
import Login from "./Login";
import Home from "./Home";
import Game from "./Game";

function App() {
  const [state, setState] = useState("login"); // login - home - game
  const [users, setUsers] = useState([]);
  const [lobbies, setLobbies] = useState([]);
  const [startLobby, setStartLobby] = useState();

  useEffect(() => {
    socket.on("join-successful", () => {
      setState("home");
    });
    socket.on("new-user", (usersArr, lobbiesArr) => {
      setUsers([...usersArr]);
      setLobbies([...lobbiesArr]);
    });
    socket.on("game-start", (lobbiesArr, lobbyIndex) => {
      if (lobbiesArr[lobbyIndex].users.some((user) => user.id === socket.id)) {
        setStartLobby(lobbiesArr[lobbyIndex]);
        setState("game");
        socket.emit("join-room", lobbiesArr[lobbyIndex]);
      } else {
        setLobbies([...lobbiesArr]);
      }
    });
    socket.on("end-game", (lobby) => {
      setState("home");
      socket.emit("leave-room", lobby);
    });
    socket.on("user-disconnected", (usersArr, lobbiesArr) => {
      setUsers([...usersArr]);
      setLobbies([...lobbiesArr]);
    });
  }, []);

  let content;
  if (state === "login") content = <Login />;
  else if (state === "home")
    content = <Home {...{ users, setUsers, lobbies, setLobbies }} />;
  else if (state === "game") {
    content = <Game startLobby={startLobby} />;
  }

  return <>{content}</>;
}

export default App;
