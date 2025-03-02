import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import images from "@/constants/images";
import icons from "@/constants/icons";

interface Props {
    onPress?: () => void;
}

export const FeaturedCard = ({ onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex flex-col items-start w-60 h-80 relative">
        <Image source={images.travel} className="size-full rounded-2xl" />
        <Image source={images.cardGradient} className="size-full rounded-2xl absolute bottom-0" />

        <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
            <Image source={icons.airplane} className="size-6.5" />
        </View>

        <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
            <Text className="text-xl font-rubik-extrabold text-white" numberOfLines={1}>Travel</Text>
            
            <View className="flex flex-row items-center justify-between w-full">
                <Text className="text-base font-rubik text-white">
                    Adventure awaits
                </Text>
                <Image source={icons.heart} className='size-5' />
            </View>
        </View>

    </TouchableOpacity>
  )
}

export const Card = ({ onPress }: Props) => {
    return (
        <TouchableOpacity onPress={onPress} className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative">
        
        <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
            <Image source={icons.airplane} className="size-4.5" />
        </View>

        <Image source={images.travel} className="w-full h-40 rounded-lg" />

        <View className="flex flex-col mt-2">
            <Text className="text-base font-rubik-bold text-black-300">Travel</Text>
            
            <View className="flex flex-row items-center justify-between mt-2">
                <Text className="text-xs font-rubik text-black-200">
                    Adventure awaits
                </Text>
                <Image source={icons.heart} className='w-5 h-5 mr-2' tintColor="#191d31" />
            </View>
        </View>

        </TouchableOpacity>
    )
}