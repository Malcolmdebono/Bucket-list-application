import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';

import images from "@/constants/images";
import icons from "@/constants/icons";

interface Props {
  experience: {
    id: string;
    name: string;
    description: string;
    image: string;
  };
  onHeartPress: (experience: { id: string; name: string; description: string; image: string }) => void; // Pass onHeartPress from parent component
}

export const Card = ({ experience, onHeartPress }: Props) => {
  return (
    <TouchableOpacity className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative">
    
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <Image source={icons.airplane} className="size-4.5" />
      </View>

      <Image source={{ uri: experience.image }} className="w-full h-40 rounded-lg" />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">{experience.name}</Text>
        
        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-xs font-rubik text-black-200">
            {experience.description}
          </Text>
          <TouchableOpacity onPress={() => onHeartPress(experience)}>
            <Image source={icons.heart} className="w-5 h-5 mr-2" tintColor="#191d31" />
          </TouchableOpacity>
        </View>
      </View>

    </TouchableOpacity>
  );
};
