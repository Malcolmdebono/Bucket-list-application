import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';

import icons from "@/constants/icons";
import images from '@/constants/images';

interface Experience {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface Props {
  experience: Experience;
  onHeartPress: (experience: Experience) => void;
}

// ---------- FEATURED CARD ----------
export const FeaturedCard = ({ experience, onHeartPress }: Props) => {
  return (
    <TouchableOpacity className="flex flex-col items-start w-60 h-80 relative">
      <Image source={{ uri: experience.image }} className="size-full rounded-2xl" />
      <View className="size-full rounded-2xl absolute bottom-0 bg-gradient-to-t from-black/70 to-transparent" />

      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <Image source={icons.airplane} className="size-6.5" />
      </View>

      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <Text className="text-xl font-rubik-extrabold text-white" numberOfLines={1}>
          {experience.name}
        </Text>

        <View className="flex flex-row items-center justify-between w-full">
          <Text className="text-base font-rubik text-white">{experience.description}</Text>
          <TouchableOpacity onPress={() => onHeartPress(experience)}>
            <Image source={icons.heart} className="size-5" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ---------- REGULAR CARD ----------
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
          <Text className="text-xs font-rubik text-black-200">{experience.description}</Text>
          <TouchableOpacity onPress={() => onHeartPress(experience)}>
            <Image source={icons.heart} className="w-5 h-5 mr-2" tintColor="#191d31" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
