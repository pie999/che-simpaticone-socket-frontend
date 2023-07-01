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
  const [usernameExists, setUsernameExists] = useState(false);
  const [lobbynameExists, setLobbynameExists] = useState(false);

  const [isInLobby, setIsInLobby] = useState(false);
  const [showLobbyForm, setshowLobbyForm] = useState(false);
  const [numberOfRounds, setNumberOfRounds] = useState(5);

  useEffect(() => {
    socket.on("username-exists", () => {
      setUsernameExists(true);
    });
    socket.on("join-successful", () => {
      setState("lobby");
      setUsernameExists(false);
    });
    socket.on("new-user", (usersArr, lobbiesArr) => {
      setUsers([...usersArr]);
      setLobbies([...lobbiesArr]);
    });
    socket.on("lobbyname-exists", () => {
      setLobbynameExists(true);
    });
    socket.on("create-lobby-successful", () => {
      setLobbyName("");
      setLobbynameExists(false);
      setIsInLobby(true);
      setshowLobbyForm(false);
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
      if (lobbiesArr[lobbyIndex].users.some((user) => user.id === socket.id)) {
        setStartLobby(lobbiesArr[lobbyIndex]);
        setState("game");
        socket.emit("join-room", lobbiesArr[lobbyIndex]);
      } else {
        setLobbies([...lobbiesArr]);
      }
    });
    socket.on("end-game", (lobby) => {
      setState("lobby");
      socket.emit("leave-room", lobby);
    });
  }, []);

  function handleUsernameSubmit(e) {
    e.preventDefault();
    if (username === "") return;
    socket.emit("new-user", username);
  }

  function handleLobbySubmit(e) {
    e.preventDefault();
    if (lobbyName === "") return;
    socket.emit("new-lobby", lobbyName);
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
    socket.emit("game-start", lobbies[lobbyIndex], numberOfRounds);
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
            maxLength={15}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameExists && <p>nickname già in uso</p>}
          <button type="submit">entra</button>
        </form>
      </div>
    );
  else if (state === "lobby")
    content = (
      <div>
        <h1>utenti online</h1>
        <div className="online-users">
          {users.map((u, i) => (
            <p key={i}>{u.name}</p>
          ))}
        </div>

        <h1>lobbies</h1>
        {!isInLobby && !showLobbyForm && (
          <button onClick={() => setshowLobbyForm(true)}>
            crea una nuova lobby
          </button>
        )}
        {showLobbyForm && (
          <form onSubmit={(e) => handleLobbySubmit(e)}>
            <label htmlFor="lobby">nome lobby</label>
            <input
              id="lobby"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
            />
            <label>
              rounds:
              <select
                value={numberOfRounds}
                onChange={(e) => setNumberOfRounds(e.target.value)}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
              </select>
            </label>
            <button type="submit">crea</button>
            <button onClick={() => setshowLobbyForm(false)}>annulla</button>
            {lobbynameExists && <p>nome lobby già in uso</p>}
          </form>
        )}
        {lobbies.map((lobby, index) => {
          return (
            <div key={index} className="lobby-list">
              <div className="lobby-div">
                <div className="lobby-top">
                  <h2>{lobby.name}</h2>
                  {lobby.inGame && <h3>partita in corso</h3>}
                  {!userInLobby(index) && !lobby.inGame && (
                    <button
                      className="join"
                      onClick={() => handleLobbyJoin(lobby.name)}
                    >
                      entra
                    </button>
                  )}
                  {userInLobby(index) && (
                    <button
                      className="exit"
                      onClick={() => handleLobbyExit(index)}
                    >
                      esci
                    </button>
                  )}
                </div>
                <div className="lobby-users">
                  {lobby.users.map((user) => (
                    <p key={user.id}>
                      {user.name} {lobby.ownerId === user.id && "👑"}
                    </p>
                  ))}
                </div>
                {userInLobby(index) && lobby.ownerId === socket.id && (
                  <button
                    className="start"
                    onClick={() => handleGameStart(index)}
                  >
                    inizia!
                  </button>
                )}
              </div>
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
