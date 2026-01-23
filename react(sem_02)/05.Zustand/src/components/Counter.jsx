import React from "react";
import { useAppStore } from "../store/useAppStore.js";

const Counter = () => {

  // -------------------------
  // ✅ SELECTORS (Picking Only Needed Data)
  // -------------------------

  // Get only count
  const count = useAppStore((state) => state.count);

  // Get only actions
  const increase = useAppStore((state) => state.increase);
  const decrease = useAppStore((state) => state.decrease);
  const reset = useAppStore((state) => state.reset);

  // Get computed value
  const getDoubleCount = useAppStore(
    (state) => state.getDoubleCount
  );


  return (
    <div style={{ border: "1px solid black", padding: "20px" }}>

      <h2>Counter</h2>

      {/* Show count */}
      <p>Count: {count}</p>

      {/* Show double count */}
      <p>Double: {getDoubleCount()}</p>

      {/* Buttons */}
      <button onClick={increase}>+</button>

      <button onClick={decrease}>-</button>

      <button onClick={reset}>Reset</button>

    </div>
  );
};

export default Counter;
