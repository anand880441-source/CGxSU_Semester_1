import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore.js";

const User = () => {

  // Local input state
  const [input, setInput] = useState("");

  // Get userName from store
  const userName = useAppStore(
    (state) => state.userName
  );

  // Get action
  const setUserName = useAppStore(
    (state) => state.setUserName
  );


  // Update name
  const handleSubmit = () => {
    setUserName(input);  // Call zustand action
    setInput("");        // Clear input
  };


  return (
    <div style={{ border: "1px solid green", padding: "20px" }}>

      <h2>User</h2>

      <p>Current User: {userName}</p>

      <input
        type="text"
        placeholder="Enter name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Change Name
      </button>

    </div>
  );
};

export default User;
