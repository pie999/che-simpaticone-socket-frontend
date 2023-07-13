import { useEffect, useState } from "react";
import { socket } from "../socket";

const audio_simpaticone = new Audio("src/audio/che-simpaticone.mp3");

function Login() {
  const [username, setUsername] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    audio_simpaticone.play();
    if (username === "") return;
    socket.emit("new-user", username);
  }

  function handleChange(e) {
    setUsername(e.target.value);
    setUsernameExists(false);
  }

  useEffect(() => {
    socket.on("username-exists", () => {
      setUsernameExists(true);
    });
  }, []);

  return (
    <div className="login-div">
      <h1 className="login-title">Che Simpaticone!</h1>
      <p className="sub-title">
        <i>il gioco che è simpatico -Salvini</i>
      </p>
      <p className="sub-sub-title">
        v 1.2 by <a href="https://github.com/pie999">pie999</a>
      </p>
      <img src="./src/images/salvini-ride.png" alt="salvini ride" />
      <form className="name-form" onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="username">NICKNAME</label>
        <input
          id="username"
          autoComplete="off"
          maxLength={12}
          value={username}
          onChange={(e) => handleChange(e)}
        />
        {usernameExists && (
          <p className="username-error">nickname già in uso</p>
        )}
        <button type="submit">ENTRA</button>
      </form>
    </div>
  );
}

export default Login;
