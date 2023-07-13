/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { socket } from "../socket";

const audio_entrare = new Audio("src/audio/entrare.mp3");

function Home({ users, lobbies, setLobbies }) {
  const [lobbyName, setLobbyName] = useState("");
  const [lobbynameExists, setLobbynameExists] = useState(false);
  const [isInLobby, setIsInLobby] = useState(false);
  const [showLobbyForm, setshowLobbyForm] = useState(false);
  const [numberOfRounds, setNumberOfRounds] = useState(5);

  useEffect(() => {
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
    socket.on("lobby-ended-game", (lobbiesArr) => {
      setLobbies([...lobbiesArr]);
    });
  }, [setLobbies]);

  function handleLobbySubmit(e) {
    e.preventDefault();
    if (lobbyName === "") return;
    socket.emit("new-lobby", lobbyName);
  }

  function handleLobbyJoin(lobbyName) {
    audio_entrare.play();
    setIsInLobby(true);
    const user = users.find((user) => user.id === socket.id);
    socket.emit("lobby-join", lobbyName, user);
  }

  function handleLobbyExit(lobbyName) {
    setIsInLobby(false);
    socket.emit("lobby-exit", lobbyName);
  }

  function userInLobby(lobbyIndex) {
    return lobbies[lobbyIndex].users.some((user) => user.id === socket.id);
  }

  function handleGameStart(lobbyName) {
    socket.emit("game-start", lobbyName, numberOfRounds);
  }

  return (
    <div className="home-div">
      <div className="users-div">
        <h1>UTENTI</h1>
        <div className="users-list">
          {users.map((u, i) => (
            <p key={i}>{u.name}</p>
          ))}
        </div>
      </div>
      <div className="lobbies-div">
        <div className="lobby-header">
          <h1>LOBBIES</h1>
          {!isInLobby && !showLobbyForm && (
            <button onClick={() => setshowLobbyForm(true)}>+</button>
          )}
        </div>

        {showLobbyForm && (
          <form className="lobby-form" onSubmit={(e) => handleLobbySubmit(e)}>
            <label htmlFor="lobby">nome lobby</label>
            <input
              id="lobby"
              autoComplete="off"
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
        <div className="lobbies-list">
          {lobbies.map((lobby, index) => {
            return (
              <div key={index} className="lobby-div">
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
                      onClick={() => handleLobbyExit(lobby.name)}
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
                    onClick={() => handleGameStart(lobby.name)}
                  >
                    inizia!
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
