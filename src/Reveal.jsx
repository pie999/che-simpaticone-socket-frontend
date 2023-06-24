/* eslint-disable react/prop-types */
import { socket } from "../socket";

function Reveal({ lobby }) {
  function handleNextRound() {
    socket.emit("next-round", lobby);
  }

  return (
    <>
      <h1>risultati round</h1>
      {lobby.users.map((u, i) => {
        return (
          <div className="answer-reveal" key={i}>
            <h2>
              {u.name} +{u.currentScore}
            </h2>
            <p>{u.answer}</p>
          </div>
        );
      })}
      {lobby.ownerId === socket.id && (
        <button className="next-round-but" onClick={handleNextRound}>
          prossimo round
        </button>
      )}
    </>
  );
}

export default Reveal;
