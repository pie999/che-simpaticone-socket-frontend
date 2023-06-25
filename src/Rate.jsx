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

const timeSeconds = 30;

function Rate({ lobby }) {
  const [votedIndex, setVotedIndex] = useState();
  const [time, setTime] = useState(timeSeconds * 1000);
  const [timeEnd] = useState(Date.now() + timeSeconds * 1000);
  const [hasTimeoutElapsed, setHasTimeoutElapsed] = useState(false);

  useEffect(() => {
    if (time > 1) {
      const timer = setTimeout(() => setTime(timeEnd - Date.now()), 1000);
      return () => clearTimeout(timer);
    } else {
      setHasTimeoutElapsed(true);
    }
  }, [time, timeEnd]);

  useEffect(() => {
    if (hasTimeoutElapsed) {
      if (votedIndex === undefined) {
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
      <p>tempo: {Math.floor(time / 1000)}</p>
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
