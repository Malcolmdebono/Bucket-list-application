// Import necessary components from react-native and React.
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

// Import images and icons constants.
import images from "@/constants/images";
import icons from "@/constants/icons";
// Import Models from react-native-appwrite to type the document.
import { Models } from 'react-native-appwrite';

// Define the Props interface which includes an item of type Models.Document and an optional onPress function.
interface Props {
    item: Models.Document;
    onPress?: () => void;
}

// FeaturedCard component: renders a card for a featured item with background image, gradient overlay,
// an icon badge, and text displaying the name and description.
export const FeaturedCard = ({ item: { image, rating, name, address, price, description }, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex flex-col items-start w-60 h-80 relative">
        {/* Display the background image */}
        <Image source={{ uri: image }} className="size-full rounded-2xl" />
        {/* Overlay the card gradient image at the bottom */}
        <Image source={images.cardGradient} className="size-full rounded-2xl absolute bottom-0" />

        {/* Display an icon badge in the top right corner */}
        <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
            <Image source={icons.airplane} className="size-6.5" />
        </View>

        {/* Container for text content at the bottom of the card */}
        <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
            {/* Display the name, limited to one line */}
            <Text className="text-xl font-rubik-extrabold text-white" numberOfLines={1}>
                {name}
            </Text>
            {/* Row container for description and heart icon */}
            <View className="flex flex-row items-center justify-between w-full">
                <Text className="text-base font-rubik text-white">
                    {description}
                </Text>
                <Image source={icons.heart} className='size-5' />
            </View>
        </View>
    </TouchableOpacity>
  )
}

// Card component: renders a standard card for an item with an image, title, description, and a heart icon.
export const Card = ({ item: { image, rating, name, address, price, description }, onPress }: Props) => {
    return (
        <TouchableOpacity onPress={onPress} className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative">
        
        {/* Icon badge positioned in the top right corner */}
        <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
            <Image source={icons.airplane} className="size-4.5" />
        </View>

        {/* Display the item image */}
        <Image source={{ uri: image }} className="w-full h-40 rounded-lg" />

        {/* Container for item text details */}
        <View className="flex flex-col mt-2">
            {/* Display the item name */}
            <Text className="text-base font-rubik-bold text-black-300">{name}</Text>
            
            {/* Row container for description and heart icon */}
            <View className="flex flex-row items-center justify-between mt-2">
                <Text className="text-xs font-rubik text-black-200">
                    {description}
                </Text>
                <Image source={icons.heart} className='w-5 h-5 mr-2' tintColor="#191d31" />
            </View>
        </View>

        </TouchableOpacity>
    )
}
