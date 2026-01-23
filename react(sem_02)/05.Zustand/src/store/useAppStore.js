// Import create function from zustand
// create() is used to make a global store
import { create } from "zustand";

// Create a Zustand store
export const useAppStore = create((set, get) => ({

  // -------------------------
  // ✅ STATE (Application Data)
  // -------------------------

  count: 0,              // Counter value
  userName: "Guest",     // User name


  // -------------------------
  // ✅ ACTIONS (Functions to Update State)
  // -------------------------

  // Increase counter
  increase: () => {
    set((state) => ({
      count: state.count + 1
    }));
  },

  // Decrease counter
  decrease: () => {
    set((state) => ({
      count: state.count - 1
    }));
  },

  // Reset counter
  reset: () => {
    set({ count: 0 });
  },

  // Update user name
  setUserName: (name) => {
    set({ userName: name });
  },


  // -------------------------
  // ✅ GETTER (Using get() to Read State)
  // -------------------------

  // Get double of count
  getDoubleCount: () => {
    return get().count * 2;
  }

}));
