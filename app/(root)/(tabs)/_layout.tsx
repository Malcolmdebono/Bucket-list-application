// Import necessary components and libraries from React Native and Expo Router.
import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from "expo-router";

// Import icon assets from constants.
import icons from '@/constants/icons'

// TabIcon component: renders the icon and label for each tab.
// It adjusts the tint color and text styling based on whether the tab is focused.
const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: any; title: string; }) => (
    <View className="flex-1 mt-3 flex flex-col items-center">
      <Image 
        source={icon} 
        // Set the icon color depending on the focus state.
        tintColor={focused ? "#0061ff" : "#666876"} 
        resizeMode="contain" 
        className="size-6"
      />
      <Text className={`${focused ? 'text-primary-300 font-rubik-medium' : 'text-black-200 font-rubik'} text-xs w-full text-center mt-1`}>
        {title}
      </Text>
    </View>
);

// TabsLayout component: defines the bottom tab navigation structure.
// It sets up the tab bar style and configures each screen with a custom tab icon.
const TabsLayout = () => {
  return (
    <Tabs       
        screenOptions={{
          // Do not show default tab labels.
          tabBarShowLabel: false,
          // Customize the tab bar style.
          tabBarStyle: {
            backgroundColor: 'white',
            position: 'absolute',
            borderTopColor: '#0061FF1A',
            borderTopWidth: 1,
            minHeight: 70,
          }
      }}>

        {/* Define the Home tab screen */}
        <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                headerShown: false,
                // Use TabIcon to render the Home tab icon and label.
                tabBarIcon: ({ focused }) => (
                    <TabIcon icon={icons.home} focused={focused} title="Home"/>
                )
            }}
        />

        {/* Define the Explore tab screen */}
        <Tabs.Screen
            name="explore"
            options={{
                title: 'Explore',
                headerShown: false,
                // Use TabIcon to render the Explore tab icon and label.
                tabBarIcon: ({ focused }) => (
                    <TabIcon icon={icons.search} focused={focused} title="Explore"/>
                )
            }}
        />

        {/* Define the Profile tab screen */}
        <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
                headerShown: false,
                // Use TabIcon to render the Profile tab icon and label.
                tabBarIcon: ({ focused }) => (
                    <TabIcon icon={icons.person} focused={focused} title="Profile"/>
                )
            }}
        />

    </Tabs>
  )
}

// Export TabsLayout as the default export.
export default TabsLayout
