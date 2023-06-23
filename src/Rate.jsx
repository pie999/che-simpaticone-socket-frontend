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
  const [hasTimeoutElapsed, setHasTimeoutElapsed] = useState(false);
  const [votedIndex, setVotedIndex] = useState();

  useEffect(() => {
    setTimeout(() => {
      setHasTimeoutElapsed(true);
    }, 10000);
  }, []);

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
