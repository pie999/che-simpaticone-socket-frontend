/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { socket } from "../socket";

// returns a random integer 0 <= r < n , excluding i
function getRandomNumberExcluding(n, i) {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * n);
  } while (randomNumber === i);
  return randomNumber;
}

function Rate({ lobby }) {
  const [votedIndex, setVotedIndex] = useState();
  const [time, setTime] = useState((lobby.users.length - 1) * 4 * 1000);
  const [timeEnd] = useState(Date.now() + time);
  const [hasTimeoutElapsed, setHasTimeoutElapsed] = useState(false);

  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => setTime(timeEnd - Date.now()), 1000);
      return () => clearTimeout(timer);
    } else {
      setHasTimeoutElapsed(true);
    }
  }, [time, timeEnd]);

  useEffect(() => {
    if (hasTimeoutElapsed) {
      if (votedIndex === undefined) {
        if (lobby.users.length === 1) {
          // edge case with only one player (otherwise getRandomNumberExcluding runs forever)
          socket.emit("update-score", 0, lobby);
          return;
        }
        const myIndex = lobby.users.findIndex((u) => u.id === socket.id);
        const randomIndex = getRandomNumberExcluding(
          lobby.users.length,
          myIndex
        );
        socket.emit("update-score", randomIndex, lobby);
      } else {
        socket.emit("update-score", votedIndex, lobby);
      }
      setHasTimeoutElapsed(false);
    }
  }, [hasTimeoutElapsed, votedIndex, lobby]);

  return (
    <div className="rate-div">
      <p>tempo: {Math.round(time / 1000)}</p>
      <h1>scegli la risposta più simpatica</h1>
      {lobby.users.map((u, i) => {
        if (u.id !== socket.id) {
          return (
            <button
              className={`user-answer ${
                i === votedIndex ? "selected-answer" : ""
              }`}
              key={i}
              onClick={() => setVotedIndex(i)}
            >
              {u.answer}
            </button>
          );
        }
      })}
    </div>
  );
}

export default Rate;
