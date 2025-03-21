// Import necessary components and functions from react-native, react, and expo-router.
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// Import images and icons from our constants folder.
import images from '@/constants/images';
import icons from '@/constants/icons';

// Import the login function from our Appwrite library and the global context hook.
import { login } from "@/lib/appwrite";
import { useGlobalContext } from '@/lib/global-provider';

// Import Redirect from expo-router to handle navigation.
import { Redirect } from "expo-router";


// Define the SignIn component.
const SignIn = () => {
  // Get the refetch function, loading state, and isLoggedIn flag from the global context.
  const { refetch, loading, isLoggedIn } = useGlobalContext();

  // If the app is not loading and the user is already logged in, redirect to the home page.
  if (!loading && isLoggedIn) return <Redirect href="/" />

  // Define a handler function for the login button press.
  const handleLogin = async () => {
    // Call the login function from Appwrite.
    const result = await login();

    // If login is successful, refetch user data to update the global context.
    if(result) {
      refetch();
    } else {
      // If login fails, show an alert to the user.
      Alert.alert('Error','Failed to login');
    }
  };

  // Render the SignIn screen UI.
  return (
    // SafeAreaView ensures that the content does not overlap with system UI elements.
    <SafeAreaView className='bg-white h-full' >
      {/* ScrollView allows vertical scrolling if content exceeds screen size */}
      <ScrollView contentContainerClassName='h-full'>
        
        {/* Display the onboarding image with cover resize mode */}
        <Image source={images.onboarding} className="w-full h-4/6" resizeMode="cover"/>

        {/* Welcome text section */}
        <View className='px-10'>
          <Text className='text-base text-center uppercase font-rubik text-black-200'>
            Welocme to BucketList
          </Text>
        </View>

        {/* Main heading with a styled part for emphasis */}
        <Text className='text-3xl font-rubik-bold text-black-300 text-center mt-2'>
          Let’s get you closer to  {"\n"} <Text className='text-primary-300'>checking off your list</Text>
        </Text>

        {/* Instruction text for login */}
        <Text className='text-lg font-rubik text-black-200 text-center mt-12'>
          Login to BucketList with Google
        </Text>

        {/* TouchableOpacity wrapping the login button */}
        <TouchableOpacity onPress={handleLogin} className='bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5'>
          {/* Container view for the button content */}
          <View className='flex flex-row items-center justify-center'>
            {/* Display Google icon */}
            <Image 
              source={icons.google}
              className='w-5 h-5'
              resizeMode='contain'
            />
            {/* Button text */}
            <Text className='text-lg font-rubik-medium text-black-300 ml-2'>
              Continue with Google
            </Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

// Export the SignIn component as the default export.
export default SignIn
