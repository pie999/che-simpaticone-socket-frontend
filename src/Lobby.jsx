/* eslint-disable react/prop-types */

function Lobby({ users }) {
  console.log(users);
  return (
    <>
      <h1>lobby</h1>
      {users.map((u, i) => (
        <p key={i}>{u.name}</p>
      ))}
    </>
  );
}

export default Lobby;
