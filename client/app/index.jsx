import React from 'react';
import { View, Text } from 'react-native';
import CalculatorScreen from './CalculatorScreen';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CalculatorScreen />
    </View>
  );
}
