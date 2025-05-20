import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const convertCurrency = async (req, res) => {
  const { from = "USD", to = "EUR", amount = 1 } = req.query;
  console.log('converting', from, to, amount);

  if (!from || !to || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid query parameters." });
  }

  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${from}/${to}/${amount}`
    );

    const { conversion_rate, conversion_result, base_code, target_code } =
      response.data;

    if (!conversion_rate) {
      return res
        .status(400)
        .json({ error: `Conversion failed for ${from} to ${to}` });
    }

    res.json({
      from: base_code,
      to: target_code,
      amount: parseFloat(amount),
      rate: conversion_rate,
      converted: conversion_result,
    });
  } catch (error) {
    console.error("Conversion error:", error.message);
    res.status(500).json({ error: "Currency conversion failed." });
  }
};

export const getAllSupportedCurrencies = async (req, res) => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/USD`
    );

    const currencies = Object.keys(response.data.conversion_rates);

    res.json({
      base: response.data.base_code,
      supportedCurrencies: currencies,
    });
  } catch (error) {
    console.error("Error fetching supported currencies:", error.message);
    res.status(500).json({ error: "Failed to retrieve supported currencies." });
  }
};
