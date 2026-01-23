import React from "react";

import Counter from "./components/Counter";
import User from "./components/User";

const App = () => {

  return (
    <div style={{ padding: "20px" }}>

      <h1>Zustand Demo App</h1>

      {/* Counter Component */}
      <Counter />

      <br />

      {/* User Component */}
      <User />

    </div>
  );
};

export default App;
