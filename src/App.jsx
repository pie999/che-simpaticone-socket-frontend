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
    socket.on("game-start", (lobby, lobbiesArr) => {
      if (lobby.users.some((user) => user.id === socket.id)) {
        setStartLobby(lobby);
        setState("game");
        socket.emit("join-room", lobby.name);
      } else {
        setLobbies([...lobbiesArr]);
      }
    });
    socket.on("end-game", (lobbyName) => {
      setState("home");
      socket.emit("leave-room", lobbyName);
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

  return <div className="app-container">{content}</div>;
}

export default App;
