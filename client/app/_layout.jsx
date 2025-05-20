import { Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Menu,
  Provider,
  IconButton,
  MD3LightTheme,
  MD3DarkTheme,
} from "react-native-paper";
import { useState } from "react";
import { View } from "react-native";
import { useCalculatorStore } from "../store/calculatorStore";

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: "#fff",
    primary: "#000",
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: "#121212",
    primary: "#fff",
  },
};

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const themeName = useCalculatorStore((state) => state.theme);
  const theme = themeName === "light" ? lightTheme : darkTheme;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Provider theme={theme}>
      <StatusBar style={themeName === "light" ? "dark" : "light"} />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Calcex",
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Currency Converter Icon */}
                <IconButton
                  icon="currency-usd"
                  iconColor={theme.colors.primary}
                  onPress={() => router.push("/CurrencyConverter")}
                />

                {/* Menu Icon */}
                <Menu
                  visible={visible}
                  onDismiss={closeMenu}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      iconColor={theme.colors.primary}
                      onPress={openMenu}
                    />
                  }
                  contentStyle={{ backgroundColor: theme.colors.background }}
                  style={{ marginRight: 30, marginTop: 45 }}
                >
                  <Menu.Item
                    onPress={() => {
                      closeMenu();
                      router.push("/Settings");
                    }}
                    title="Settings"
                  />
                  <Menu.Item
                    onPress={() => {
                      closeMenu();
                      router.push("/History");
                    }}
                    title="History"
                  />
                </Menu>
              </View>
            ),
          }}
        />
      </Stack>
    </Provider>
  );
}
