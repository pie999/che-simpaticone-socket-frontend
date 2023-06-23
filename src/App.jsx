import { useState, useEffect } from "react";
import "./App.css";
import { socket } from "../socket";
import Game from "./Game";

function App() {
  const [state, setState] = useState("name"); // name - lobby - game
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [lobbyName, setLobbyName] = useState("");
  const [lobbies, setLobbies] = useState([]);
  const [startLobby, setStartLobby] = useState();

  const [isInLobby, setIsInLobby] = useState(false);
  const [showLobbyForm, setshowLobbyForm] = useState(false);

  useEffect(() => {
    socket.on("new-user", (usersArr, lobbiesArr) => {
      setUsers([...usersArr]);
      setLobbies([...lobbiesArr]);
    });
    socket.on("new-lobby", (lobbiesArr) => {
      setLobbies([...lobbiesArr]);
    });
    socket.on("lobby-join", (lobbiesArr) => {
      setLobbies([...lobbiesArr]);
    });
    socket.on("lobby-exit", (lobbiesArr) => {
      setLobbies([...lobbiesArr]);
    });
    socket.on("user-disconnected", (usersArr, lobbiesArr) => {
      setUsers([...usersArr]);
      setLobbies([...lobbiesArr]);
    });
    socket.on("game-start", (lobbiesArr, lobbyIndex) => {
      console.log(lobbiesArr[lobbyIndex]);
      setStartLobby(lobbiesArr[lobbyIndex]);
      setState("game");
      socket.emit("join-room", lobbyIndex);
    });
  }, []);

  function handleUsernameSubmit(e) {
    e.preventDefault();
    setState("lobby");
    const newUser = { id: socket.id, name: username };
    socket.emit("new-user", newUser);
  }

  function handleLobbySubmit(e) {
    e.preventDefault();
    setLobbyName(""); // remember that values change at new render
    setIsInLobby(true);
    setshowLobbyForm(false);
    const user = users.find((user) => user.id === socket.id);
    const newLobby = { name: lobbyName, ownerId: socket.id, users: [user] };
    socket.emit("new-lobby", newLobby);
  }

  function handleLobbyJoin(lobbyName) {
    setIsInLobby(true);
    const user = users.find((user) => user.id === socket.id);
    socket.emit("lobby-join", lobbyName, user);
  }

  function handleLobbyExit(lobbyIndex) {
    setIsInLobby(false);
    socket.emit("lobby-exit", lobbyIndex);
  }

  function userInLobby(lobbyIndex) {
    return lobbies[lobbyIndex].users.some((user) => user.id === socket.id);
  }

  function handleGameStart(lobbyIndex) {
    socket.emit("game-start", lobbyIndex);
  }

  let content;
  if (state === "name")
    content = (
      <div className="name-div">
        <h1 className="name-title">Che Simpaticone!</h1>
        <form className="name-form" onSubmit={(e) => handleUsernameSubmit(e)}>
          <label htmlFor="username">nickname</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">entra</button>
        </form>
      </div>
    );
  else if (state === "lobby")
    content = (
      <div className="lobby-div">
        <h1>utenti online</h1>
        {users.map((u, i) => (
          <p key={i}>{u.name}</p>
        ))}

        <h1>lobbies</h1>
        {!isInLobby && !showLobbyForm && (
          <button onClick={() => setshowLobbyForm(true)}>
            crea una nuova lobby
          </button>
        )}
        {showLobbyForm && (
          <form onSubmit={(e) => handleLobbySubmit(e)}>
            <label htmlFor="lobby">crea una nuova lobby</label>
            <input
              id="lobby"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
            />
            <button type="submit">crea</button>
            <button onClick={() => setshowLobbyForm(false)}>annulla</button>
          </form>
        )}
        {lobbies.map((lobby, index) => {
          return (
            <div key={index}>
              <h2>{lobby.name}</h2>
              {!userInLobby(index) && (
                <button onClick={() => handleLobbyJoin(lobby.name)}>
                  entra
                </button>
              )}
              {userInLobby(index) && (
                <button onClick={() => handleLobbyExit(index)}>esci</button>
              )}
              {lobby.users.map((user) => (
                <p key={user.id}>
                  {user.name} {lobby.ownerId === user.id && "👑"}
                </p>
              ))}
              {userInLobby(index) && lobby.ownerId === socket.id && (
                <button onClick={() => handleGameStart(index)}>inizia!</button>
              )}
            </div>
          );
        })}
      </div>
    );
  else if (state === "game") {
    content = <Game startLobby={startLobby} />;
  }

  return <>{content}</>;
}

export default App;
