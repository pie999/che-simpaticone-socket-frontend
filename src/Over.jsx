/* eslint-disable react/prop-types */
import { socket } from "../socket";

function Over({ lobby }) {
  return (
    <>
      <h1>classifica finale</h1>
      {lobby.users.map((u, i) => {
        return (
          <p key={i}>
            {u.totalScore} {u.name}
          </p>
        );
      })}
      {lobby.ownerId === socket.id && (
        <>
          <button onClick={() => socket.emit("game-start", lobby)}>
            nuova partita
          </button>
          <button onClick={() => socket.emit("end-lobby", lobby)}>esci</button>
        </>
      )}
    </>
  );
}

export default Over;
