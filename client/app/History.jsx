import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useCalculatorStore } from "../store/calculatorStore";
import * as Clipboard from "expo-clipboard";
import * as Haptics from 'expo-haptics';

export default function HistoryScreen() {
  const history = useCalculatorStore((s) => s.history);
  const setHistory = useCalculatorStore((s) => s.setHistory);
  const theme = useCalculatorStore((s) => s.theme);

  const isLight = theme === "light";
  const backgroundColor = isLight ? "#fff" : "#121212";
  const cardColor = isLight ? "#f5f5f5" : "#1e1e1e";
  const textColor = isLight ? "#000" : "#fff";

  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelection = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const onPressCard = (item, index) => {
    if (selectMode) {
      toggleSelection(index);
    } else {
      Clipboard.setStringAsync(item.expression);
    }
  };

  const onLongPressCard = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectMode(true);
    setSelectedItems([index]);
  };

  const deleteSelected = () => {
    const newHistory = history.filter((_, index) => !selectedItems.includes(index));
    setHistory(newHistory);
    setSelectMode(false);
    setSelectedItems([]);
  };

  const cancelSelection = () => {
    setSelectMode(false);
    setSelectedItems([]);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === history.length) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSelectedItems([]);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSelectedItems(history.map((_, index) => index));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          {selectMode ? "Select Items" : "Calculation History"}
        </Text>
        {selectMode && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={toggleSelectAll}>
              <Text style={[styles.actionText, { color: textColor }]}>
                {selectedItems.length === history.length ? "Deselect All" : "Select All"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelSelection}>
              <Text style={[styles.actionText, { color: textColor }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Confirm Delete", "Delete selected items?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", onPress: deleteSelected, style: "destructive" },
                ])
              }
            >
              <Text style={[styles.actionText, { color: "red" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={()=>{
          return (
            <View style={{ flex:1, height: '100%', width: '100%', justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: textColor}}>No history available</Text>
            </View>
          );
        }}
        renderItem={({ item, index }) => {
          const isSelected = selectedItems.includes(index);
          return (
            <TouchableOpacity
              onPress={() => onPressCard(item, index)}
              onLongPress={() => onLongPressCard(index)}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected ? "#1976D2" : cardColor,
                  borderColor: isSelected ? "#0D47A1" : "transparent",
                  borderWidth: isSelected ? 2 : 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.expression,
                  { color: isSelected ? "#fff" : textColor },
                ]}
              >
                {item.expression}
              </Text>
              <Text
                style={[
                  styles.result,
                  { color: isSelected ? "#fff" : textColor },
                ]}
              >
                = {item.result}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    padding: 16,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expression: {
    fontSize: 20,
  },
  result: {
    fontSize: 20,
    width: "20%",
    fontStyle: "italic",
    textAlign: "right",
  },
});
