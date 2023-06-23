/* eslint-disable react/prop-types */
import { useState } from "react";
import { socket } from "../socket";

function LogInScreen({ setUser, user }) {
  const [username, setUsername] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setUser({ name: username });
    socket.emit("join", user);
  }

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="username">nickname</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">entra</button>
      </form>
    </>
  );
}

export default LogInScreen;
