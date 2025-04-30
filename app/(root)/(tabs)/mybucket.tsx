// app/mybucket.tsx
import React, { useState } from "react";
import { router } from "expo-router";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  Switch,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import images from "@/constants/images";

export default function MyBucket() {
  const { user } = useGlobalContext();
  const [bucketItems, setBucketItems]     = useState<any[]>([]);
  const [showForm, setShowForm]           = useState(false);
  const [name, setName]                   = useState("");
  const [description, setDescription]     = useState("");
  const [achieved, setAchieved]           = useState(false);
  const [targetDate, setTargetDate]       = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selected) setTargetDate(selected);
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
        <View className="flex-row items-center">
          <Image
            source={{ uri: user?.avatar }}
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-xs font-rubik text-gray-500">Collab</Text>
            <Text className="text-base font-rubik-medium text-gray-800">
              {user?.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={icons.bell} className="w-6 h-6" />
        </TouchableOpacity>
      </View>

      {/* Main content or Form */}
      {showForm ? (
        <View className="absolute inset-0 bg-white">
          {/* Full-width top image */}
          <Image
            source={images.onboarding}
            className="w-full h-80"
            resizeMode="cover"
          />
          <View className="px-5 pt-4">
            {/* Name input */}
            <Text className="text-sm font-rubik-medium text-gray-700 mb-2">
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter bucket name"
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />

            {/* Description input */}
            <Text className="text-sm font-rubik-medium text-gray-700 mb-2">
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-6 text-base"
            />

            {/* Achieved toggle */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-sm font-rubik-medium text-gray-700">
                Achieved
              </Text>
              <Switch
                value={achieved}
                onValueChange={setAchieved}
                trackColor={{ false: "#ccc", true: "#4F46E5" }}
                thumbColor="#fff"
              />
            </View>

            {/* Target Date picker */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-sm font-rubik-medium text-gray-700">
                Target Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <Text className="text-base font-rubik">
                  {targetDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={targetDate}
                mode="date"
                display="calendar"
                onChange={onChangeDate}
                className="mb-6"
              />
            )}

            {/* Action buttons */}
            <View className="flex-row justify-end space-x-4 mb-6">
              <TouchableOpacity
                onPress={() => setShowForm(false)}
                className="px-4 py-2"
              >
                <Text className="text-gray-600 font-rubik">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // TODO: Save logic here
                  setShowForm(false);
                }}
                className="bg-primary-300 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-rubik">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center px-5">
          {bucketItems.length === 0 ? (
            <Text className="text-gray-400 font-rubik text-lg">
              Your bucket is empty
            </Text>
          ) : (
            <FlatList
              data={bucketItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Text className="py-2 text-gray-800">{item.title}</Text>
              )}
            />
          )}
        </View>
      )}

      {/* Floating Add Button */}
      {!showForm && (
        <TouchableOpacity
          onPress={() => setShowForm(true)}
          className="absolute bottom-28 right-6 bg-primary-300 px-5 py-4 rounded-full flex-row items-center justify-center shadow-lg"
        >
          <Text className="text-white text-3xl leading-none">+</Text>
          <Text className="text-white text-base font-rubik ml-3">Bucket</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
