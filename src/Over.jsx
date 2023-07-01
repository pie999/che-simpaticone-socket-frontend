/* eslint-disable react/prop-types */
import { socket } from "../socket";

function Over({ lobby }) {
  return (
    <div className="final">
      <h1>classifica finale</h1>
      {lobby.users.map((u, i) => {
        return (
          <h2 key={i}>
            {u.totalScore} {u.name}
          </h2>
        );
      })}
      {lobby.ownerId === socket.id && (
        <>
          <button
            className="new-game"
            onClick={() => socket.emit("game-start", lobby, lobby.totalRounds)}
          >
            nuova partita
          </button>
          <button
            className="exit"
            onClick={() => socket.emit("end-lobby", lobby)}
          >
            esci
          </button>
        </>
      )}
    </div>
  );
}

export default Over;
