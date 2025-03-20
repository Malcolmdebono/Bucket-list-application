// Import the global context hook to access authentication state.
import { useGlobalContext } from "@/lib/global-provider";
// Import Redirect and Slot components from expo-router for navigation.
import { Redirect, Slot } from "expo-router";
// Import ActivityIndicator for loading indication.
import { ActivityIndicator } from "react-native";
// Import SafeAreaView to ensure content stays within safe areas of the device screen.
import { SafeAreaView } from "react-native-safe-area-context";

// Define and export the AppLayout component.
export default function AppLayout(){
    // Retrieve loading and isLoggedIn states from the global context.
    const { loading, isLoggedIn } = useGlobalContext();

    // If the app is still loading (e.g., fetching user data), display a loading indicator.
    if(loading){
        return (
            <SafeAreaView className="bg-white h-full flex justify-center items-center">
                <ActivityIndicator className="text-primary-300" size="large" />
            </SafeAreaView>
        )
    }

    // If the user is not logged in, redirect them to the sign-in screen.
    if(!isLoggedIn) return <Redirect href='/sign-in' /> 

    // If the user is logged in and the app is not loading, render the Slot component
    // which displays the nested routes or child components.
    return <Slot />
}
