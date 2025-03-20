// Import necessary components from react-native and React.
import { View, Text, Image } from 'react-native'
import React from 'react'

// Import images from the constants folder.
import images from "@/constants/images";

// Define the NoResult component which displays a message when no data is available.
const NoResult = () => {
  return (
    // Container view for the no-result message, with centered content and vertical margin.
    <View className='flex items-center my-5'>
      {/* Display the no-result image, styled to take most of the width and a fixed height, with 'contain' resize mode */}
      <Image source={images.noResult} className="w-11/12 h-80" resizeMode="contain" />
      {/* Display the primary message indicating no results were found */}
      <Text className="text-2xl font-rubik-bold text-black-300 mt-5">
        No Results
      </Text>
      {/* Display a secondary message providing additional context */}
      <Text className="text-base text-black-100 mt-2">
        Could not fetch results
      </Text>
    </View>
  )
}

// Export the NoResult component as the default export.
export default NoResult
