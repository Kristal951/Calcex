import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { evaluate as mathEvaluate } from "mathjs";

export const useCalculatorStore = create((set, get) => ({
  display: "",
  result: "",
  history: [],
  theme: "light",

  setDisplay: (expr) => {
    set({ display: expr });
    try {
      const parsed = expr.replace(/×/g, "*").replace(/÷/g, "/");
      const res = mathEvaluate(parsed);
      set({ result: res.toString() });
    } catch {
      set({ result: "" });
    }
  },

  setTheme: (theme) => set({ theme }),
  setResult: (result) => set({ result }),

  append: (val) => {
    const display = get().display + val;
    set({ display });

    try {
      const parsed = display.replace(/×/g, "*").replace(/÷/g, "/");
      const res = mathEvaluate(parsed);
      set({ result: res.toString() });
    } catch {
      set({ result: "" });
    }
  },

  evaluate: () => {
    const res = get().result;
    const expr = get().display;
    if (!expr || !res) return;

    const newHistory = [{ expression: expr, result: res }, ...get().history];

    set({
      display: `${expr} = ${res}`,
      result: "",
      history: newHistory,
    });

    AsyncStorage.setItem("history", JSON.stringify(newHistory));
  },

  clear: () => set({ display: "", result: "" }),

  backspace: () =>
    set((state) => {
      const newDisplay = state.display.slice(0, -1);
      let newResult = "";
      try {
        const parsed = newDisplay.replace(/×/g, "*").replace(/÷/g, "/");
        newResult = mathEvaluate(parsed).toString();
      } catch {
        newResult = "";
      }
      return {
        display: newDisplay,
        result: newResult,
      };
    }),

  loadHistory: async () => {
    const data = await AsyncStorage.getItem("history");
    if (data) set({ history: JSON.parse(data) });
  },

   clearHistory: async () => {
    set({ history: [] });
    await AsyncStorage.removeItem("history");
  },

  setHistory: (history) => {
  set({ history });
  AsyncStorage.setItem("history", JSON.stringify(history));
},

}));
