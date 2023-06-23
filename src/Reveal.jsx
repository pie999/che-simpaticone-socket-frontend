/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { socket } from "../socket";

function Reveal({ lobby }) {
  const [hasTimeoutElapsed, setHasTimeoutElapsed] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setHasTimeoutElapsed(true);
  //   }, 5000);
  // }, []);

  // useEffect(() => {
  //   if (hasTimeoutElapsed) {
  //     socket.emit("submit-answer", answer, lobby);
  //     setHasTimeoutElapsed(false);
  //   }
  // }, [hasTimeoutElapsed, answer, lobby]);

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
    </>
  );
}

export default Reveal;
