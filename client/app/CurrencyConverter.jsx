import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import { useCalculatorStore } from "@/store/calculatorStore";

const BASE_URL = "http://192.168.90.227:5000";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [currencies, setCurrencies] = useState([]);
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(false);

  const { theme } = useCalculatorStore();

  const reset = () => {
    setAmount("1");
    setConverted(null);
    setFromCurrency("USD");
    setToCurrency("EUR");
  };

  const currencyToCountry = {
    USD: "US",
    AED: "AE",
    AFN: "AF",
    ZWL: "ZW",
  };

  const getFlagEmoji = (currencyCode) => {
    const countryCode =
      currencyToCountry[currencyCode] || currencyCode.slice(0, 2);
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(char.charCodeAt(0) + 127397)
      );
  };

  useEffect(() => {
    const fetchSupportedCurrencies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/currency/supportedCurrencies`
        );
        if (res.data?.supportedCurrencies) {
          const items = res.data.supportedCurrencies.map((cur) => ({
            label: `${getFlagEmoji(cur)} ${cur}`,
            value: cur,
          }));
          setCurrencies(items);
        }
      } catch (err) {
        console.error("Error fetching supported currencies", err);
        Alert.alert("Error", "Unable to fetch currency list.");
      } finally {
        setLoading(false);
      }
    };
    fetchSupportedCurrencies();
  }, []);

  const convert = async () => {
    if (!amount || isNaN(amount)) {
      return Alert.alert("Error", "Please enter a valid number.");
    }

    if (fromCurrency === toCurrency) {
      setConverted(parseFloat(amount).toFixed(2));
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/currency/convert`, {
        params: {
          from: fromCurrency,
          to: toCurrency,
          amount,
        },
      });
      const value = parseFloat(res?.data?.converted).toFixed(5);
      setConverted(value);
    } catch (err) {
      console.error("Error during conversion", err);
      Alert.alert("Error", "Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#fff" : "#2d2d2d" },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme === "light" ? "#2596be" : "#fff" },
        ]}
      >
        Currency Converter
      </Text>

      <Text
        style={[
          styles.label,
          { color: theme === "light" ? "#2596be" : "#fff" },
        ]}
      >
        Amount
      </Text>
      <TextInput
        style={[
          styles.input,
          { color: theme === "dark" ? "#fff" : "#222" },
          theme === "dark" && styles.inputDark,
        ]}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        editable={!loading}
        placeholder="Enter amount"
        placeholderTextColor={theme === "light" ? "#999" : "#ccc"}
      />

      <Text
        style={[
          styles.label,
          { color: theme === "light" ? "#2596be" : "#fff" },
        ]}
      >
        From
      </Text>
      <Dropdown
        style={[
          styles.dropdown,
          loading && styles.disabled,
          theme === "dark" && styles.dropdownDark,
        ]}
        containerStyle={theme === "dark" ? styles.dropdownContainerDark : null}
        placeholderStyle={{
          color: theme === "dark" ? "#ccc" : "#666",
        }}
        selectedTextStyle={{
          color: theme === "dark" ? "#fff" : "#000",
        }}
        inputSearchStyle={{
          backgroundColor: theme === "dark" ? "#444" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
        }}
        data={currencies}
        search
        searchPlaceholder="Search currency"
        labelField="label"
        valueField="value"
        placeholder="Select currency"
        value={fromCurrency}
        onChange={(item) => setFromCurrency(item.value)}
        disabled={loading}
      />

      <Text
        style={[
          styles.label,
          { color: theme === "light" ? "#2596be" : "#fff" },
        ]}
      >
        To
      </Text>
      <Dropdown
        style={[
          styles.dropdown,
          loading && styles.disabled,
          theme === "dark" && styles.dropdownDark,
        ]}
        containerStyle={theme === "dark" ? styles.dropdownContainerDark : null}
        placeholderStyle={{
          color: theme === "dark" ? "#ccc" : "#666",
        }}
        selectedTextStyle={{
          color: theme === "dark" ? "#fff" : "#000",
        }}
        inputSearchStyle={{
          backgroundColor: theme === "dark" ? "#444" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
        }}
        data={currencies}
        search
        searchPlaceholder="Search currency"
        labelField="label"
        valueField="value"
        placeholder="Select currency"
        value={toCurrency}
        onChange={(item) => setToCurrency(item.value)}
        disabled={loading}
      />

      {converted && (
        <Text
          style={[
            styles.result,
            { color: theme === "light" ? "#2596be" : "#fff" },
          ]}
        >
          {amount} {fromCurrency} = {converted} {toCurrency}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2596be"
          style={{ marginTop: 20 }}
        />
      ) : (
        <>
          <TouchableOpacity
            disabled={!currencies.length || loading}
            style={[
              styles.convertButton,
              {
                backgroundColor: theme === "light" ? "#2596be" : "#fff",
              },
            ]}
            onPress={convert}
          >
            <Text
              style={{
                fontSize: 19,
                color: theme === "light" ? "#fff" : "#000",
              }}
            >
              Convert
            </Text>
          </TouchableOpacity>

          {converted && (
            <TouchableOpacity
              onPress={reset}
              style={[
                styles.resetButton,
                {
                  backgroundColor: theme === "light" ? "#2596be" : "#fff",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 19,
                  color: theme === "light" ? "#fff" : "#000",
                }}
              >
                Reset
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderColor: "#2596be",
    borderWidth: 1,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  inputDark: {
    backgroundColor: "#444",
    borderColor: "#888",
  },
  dropdown: {
    height: 50,
    borderColor: "#2596be",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    justifyContent: "center",
  },
  dropdownDark: {
    backgroundColor: "#444",
    borderColor: "#888",
  },
  dropdownContainerDark: {
    backgroundColor: "#333",
    borderColor: "#888",
  },
  disabled: {
    backgroundColor: "#e0e0e0",
  },
  convertButton: {
    marginTop: 20,
    borderRadius: 8,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButton: {
    marginTop: 10,
    borderRadius: 8,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  result: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
});
