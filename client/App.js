import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
// import Index from '@/app/Home';
import '@/global.css';
import { useEffect } from 'react';

export default function App() {
   const systemTheme = useColorScheme(); 
   const setTheme = useCalculatorStore((s) => s.setTheme);

   useEffect(() => {
    if (systemTheme) {
      setTheme(systemTheme); // Set theme on load
    }
  }, [systemTheme]);

  return (
    <Index />
  );
}

