// Import necessary modules from expo-router, expo-font, and other libraries.
import { Stack } from "expo-router";
import "./globals.css"; // Import global CSS for styling.
import { useFonts } from "expo-font"; // Hook to load custom fonts.
import { useEffect } from "react"; // React hook for side effects.
import * as SplashScreen from "expo-splash-screen"; // Splash screen control.
import GlobalProvider from "@/lib/global-provider"; // Global context provider for the app.

// Define the RootLayout component, which sets up the app's global state and fonts.
export default function RootLayout() {
  // Load custom fonts using the useFonts hook.
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  // Hide the splash screen when fonts are loaded.
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // If fonts are not loaded yet, return null to avoid rendering the app without proper fonts.
  if (!fontsLoaded) {
    return null;
  }

  // Render the app's global provider and the stack navigator with header hidden.
  return (
    <GlobalProvider>
        <Stack screenOptions={{headerShown: false}}/>;
    </GlobalProvider>
  ) 
}
