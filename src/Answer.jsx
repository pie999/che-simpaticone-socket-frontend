/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { socket } from "../socket";

function Answer({ lobby }) {
  const [answer, setAnswer] = useState("");
  const [hasTimeoutElapsed, setHasTimeoutElapsed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHasTimeoutElapsed(true);
    }, 10000);
  }, []);

  useEffect(() => {
    if (hasTimeoutElapsed) {
      socket.emit("submit-answer", answer, lobby);
      setHasTimeoutElapsed(false);
    }
  }, [hasTimeoutElapsed, answer, lobby]);

  return (
    <div className="answer-div">
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
