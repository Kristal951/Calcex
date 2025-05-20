import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { useCalculatorStore } from "../store/calculatorStore"; // Adjust path if needed

export default function Settings() {
  const theme = useCalculatorStore((state) => state.theme);
  const setTheme = useCalculatorStore((state) => state.setTheme);

  const toggleSwitch = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#fff" : "#121212" },
      ]}
    >
      <Text style={[styles.label, { color: theme === "light" ? "#000" : "#fff" }]}>
        Dark Mode
      </Text>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleSwitch}
        thumbColor={theme === "dark" ? "#f4f3f4" : "#f4f3f4"}
        trackColor={{ false: "#767577", true: "#81C784" }}
      />

      <Text
        style={[
          styles.versionText,
          { color: theme === "light" ? "#000" : "#fff", marginTop: 40 },
        ]}
      >
        App Version: {Constants?.manifest?.version || "1.0.0"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 22, marginBottom: 10 },
  versionText: { fontSize: 18 },
});
