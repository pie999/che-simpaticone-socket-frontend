/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { socket } from "../socket";

const timeSeconds = 30;

function Answer({ lobby }) {
  const [answer, setAnswer] = useState("");
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
      socket.emit("submit-answer", answer, lobby);
      setHasTimeoutElapsed(false);
    }
  }, [hasTimeoutElapsed, answer, lobby]);

  return (
    <div className="answer-div">
      <p>tempo: {Math.floor(time / 1000)}</p>
      <h1 className="answer-prompt">
        descrivi la tua giornata in quattro parole
      </h1>
      <textarea
        className="answer-area"
        maxLength="150"
        rows="3"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      ></textarea>
    </div>
  );
}

export default Answer;
