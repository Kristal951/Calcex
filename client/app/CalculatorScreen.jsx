import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCalculatorStore } from "../store/calculatorStore";
import { evaluate as mathEvaluate } from "mathjs";
import { useSearchParams } from "expo-router/build/hooks";

const buttons = [
  ["AC", "(", ")", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "back", "="],
];

export default function CalculatorScreen() {
  const {
    display,
    result,
    clear,
    backspace,
    append,
    evaluate,
    setResult,
    theme,
  } = useCalculatorStore();

  const [justEvaluated, setJustEvaluated] = useState(false);
  const { expr } = useSearchParams();

  const setDisplay = useCalculatorStore((state) => state.setDisplay);

  useEffect(() => {
    if (expr) {
      setDisplay(expr);
    }
  }, [expr]);

  useEffect(() => {
    try {
      const parsed = display.replace(/×/g, "*").replace(/÷/g, "/");
      if (parsed && !justEvaluated) {
        const evalResult = mathEvaluate(parsed);
        setResult(evalResult.toString());
      } else if (!parsed) {
        setResult("");
      }
    } catch (error) {
      setResult("");
    }
  }, [display]);

  const onPress = (value) => {
    if (justEvaluated && /[0-9.]/.test(value)) {
      // If a number is pressed after "=", start new expression
      clear();
      setJustEvaluated(false);
      append(value);
      return;
    }

    switch (value) {
      case "AC":
        clear();
        break;
      case "back":
        backspace();
        break;
      case "=":
        evaluate();
        setJustEvaluated(true);
        break;
      default:
        append(value);
        setJustEvaluated(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#fff" : "#2d2d2d" },
      ]}
    >
      <View
        style={[
          styles.displayContainer,
          { backgroundColor: theme === "light" ? "#fff" : "#2d2d2d" },
        ]}
      >
        <Text
          style={[
            styles.displayText,
            { color: theme === "light" ? "#000" : "#fff" },
          ]}
          numberOfLines={1}
        >
          {display || "0"}
        </Text>
        {result && !justEvaluated && (
          <Text
            style={[
              styles.resultText,
              { color: theme === "light" ? "#888" : "#bbb" },
            ]}
          >
            = {result}
          </Text>
        )}
        {justEvaluated && result && (
          <Text
            style={[
              styles.resultText,
              { color: theme === "light" ? "#4CAF50" : "#80e27e" },
            ]}
          >
            = {result}
          </Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button) => (
              <TouchableOpacity
                key={button}
                style={[
                  styles.button,
                  {
                    backgroundColor: theme === "light" ? "#e0e0e0" : "#3d3d3d",
                  },
                  button === "=" && styles.equalsButton,
                ]}
                onPress={() => onPress(button)}
              >
                {button === "back" ? (
                  <MaterialCommunityIcons
                    name="backspace-outline"
                    size={24}
                    color="red"
                  />
                ) : (
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          button === "=" || button === "back"
                            ? "#fff"
                            : theme === "light"
                            ? "#000"
                            : "#fff",
                      },
                    ]}
                  >
                    {button}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  displayContainer: {
    width: "100%",
    height: 200,
    padding: 20,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  displayText: {
    fontSize: 42,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 24,
  },
  buttonsContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
  button: {
    flex: 1,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  equalsButton: {
    backgroundColor: "#2596be",
  },
  clearButton: {
    color: "#F44226",
  },
  ACbutton: {
    backgroundColor: "",
  },
  buttonText: {
    fontSize: 28,
    fontWeight: "500",
  },
});
