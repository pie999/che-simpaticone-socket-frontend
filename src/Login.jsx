import { useEffect, useState } from "react";
import { socket } from "../socket";

function Login() {
  const [username, setUsername] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
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
    <div className="name-div">
      <h1 className="name-title">Che Simpaticone!</h1>
      <p className="sub-title">
        v 1.2 by <a href="https://github.com/pie999">pie999</a>
      </p>
      <form className="name-form" onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="username">nickname</label>
        <input
          id="username"
          autoComplete="off"
          maxLength={15}
          value={username}
          onChange={(e) => handleChange(e)}
        />
        {usernameExists && <p>nickname già in uso</p>}
        <button type="submit">entra</button>
      </form>
    </div>
  );
}

export default Login;
