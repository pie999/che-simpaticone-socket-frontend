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
    <>
      <h1>promp simpatico</h1>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
    </>
  );
}

export default Answer;
