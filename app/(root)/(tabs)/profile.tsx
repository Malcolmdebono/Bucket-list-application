// Import necessary components and libraries from React Native and React.
import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType, Alert } from 'react-native'
import React from 'react'
// Import SafeAreaView to ensure content is displayed within safe boundaries on different devices.
import { SafeAreaView } from 'react-native-safe-area-context';

// Import icons and images from constants.
import icons from "@/constants/icons";
import images from "@/constants/images";
// Import settings data for the Profile screen.
import { settings } from "@/constants/data";
// Import the global context hook to retrieve user information.
import { useGlobalContext } from '@/lib/global-provider';

// Import the logout function from Appwrite for logging out the user.
import { logout } from "@/lib/appwrite";

// Define an interface for the SettingsItem component props.
interface SettingsItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

// SettingsItem component: renders a row with an icon, title, and an optional arrow.
// It accepts an onPress function to handle user interactions.
const SettingsItem = ({icon, title, onPress, textStyle, showArrow = true} : SettingsItemProps) => (
  <TouchableOpacity onPress={onPress} className="flex flex-row items-center justify-between py-3">
    <View className="flex flex-row items-center gap-3">
      {/* Display the provided icon */}
      <Image source={icon} className="size-6"/>
      {/* Display the title with dynamic styling */}
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
    </View>
    {/* Conditionally display the right arrow icon if showArrow is true */}
    {showArrow && <Image source={icons.rightArrow} className="size-5"/>}
  </TouchableOpacity>
)

// Profile component: displays user profile details along with settings and logout functionality.
const Profile = () => {
  // Retrieve user data and refetch function from the global context.
  const { user, refetch } = useGlobalContext(); 

  // Handler function for logging out the user.
  const handleLogout = async () => {
    const result = await logout();
    
    // Show success alert and refetch user data if logout is successful.
    if(result){
      Alert.alert("Success", "You have been logged out successfully");
      refetch();
    }else {
      // Show error alert if logout fails.
      Alert.alert("Success", "An error occurred while logging out")
    }
  };

  return (
    // SafeAreaView ensures content is rendered within the safe area boundaries.
    <SafeAreaView className="h-full bg-white">
      {/* ScrollView enables vertical scrolling for the profile content. */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        {/* Header section displaying the title "Profile" and a bell icon for notifications. */}
        <View className='flex flex-row items-center justify-between mt-5'>
          <Text className="text-xl font-rubik-bold">
            Profile
          </Text>
          <Image source={icons.bell} className="size-5"/>
        </View>

        {/* User information section with avatar and name display */}
        <View className="flex-row justify-center flex mt-5">
          <View className='flex flex-col items-center relative mt-5'>
            {/* Display user's avatar */}
            <Image source={{uri: user?.avatar}} className="size-44 relative rounded-full"></Image>
            {/* Edit button overlay on the avatar */}
            <TouchableOpacity className="absolute bottom-11 right-2">
              <Image source={icons.edit} className="size-9"/>
            </TouchableOpacity>
            {/* Display user's name */}
            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
          </View>
        </View>

        {/* Section for static settings options (e.g., My BuckList, Payments) */}
        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.bucketlist} title="My BuckList" />
          <SettingsItem icon={icons.wallet} title="Payments" />
        </View>

        {/* Section for additional settings, separated by a top border */}
        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            // Render each settings item; keys are set by index.
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        {/* Section for logout functionality with its own border separation */}
        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          <SettingsItem 
            icon={icons.logout} 
            title="Logout" 
            textStyle="text-danger" 
            showArrow={false} 
            onPress={handleLogout} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

// Export the Profile component as the default export.
export default Profile
