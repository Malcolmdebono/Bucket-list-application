// app/mybucket.tsx
import React, { useState, useEffect } from "react";
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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import images from "@/constants/images";

type Point = {
  pointName: string;
  status: boolean;
  deadline: Date;
};

type ItemResponse = {
  _id: string;
  title: string;
  points: {
    pointname: string;
    status: string;    // "Done" or "Pending"
    deadline: string;
  }[];
};

export default function MyBucket() {
  const { user } = useGlobalContext();
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom + 80;

  const API_URL = "http://192.168.1.198:3000";
  const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluX3ZpbGxpeWFtMiIsImlhdCI6MTc0Njk4NTk5MSwiZXhwIjoxNzQ2OTg5NTkxfQ.9PAq3VVncYJFUIoh9VBoWJ2bJ6KjCCsJJ1H4jMr415s";

  const USER_ID = "67cc991928452d26b9b2da88";

  const [bucketItems, setBucketItems] = useState<ItemResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState<Point[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<number | null>(null);

  // Fetch all items on mount
  useEffect(() => {
    fetch(`${API_URL}/api/items`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
      .then((r) => r.json())
      .then((items: ItemResponse[]) => setBucketItems(items))
      .catch(console.error);
  }, []);

  // Form helpers
  const addPoint = () =>
    setPoints((prev) => [
      ...prev,
      { pointName: "", status: false, deadline: new Date() },
    ]);

  const updatePoint = (i: number, field: keyof Point, val: any) => {
    const copy = [...points];
    copy[i][field] = val;
    setPoints(copy);
  };

  const onChangeDate = (_: any, date?: Date, idx?: number) => {
    if (date && typeof idx === "number") updatePoint(idx, "deadline", date);
    setShowDatePicker(null);
  };

  const handleItemPress = (item: ItemResponse) => {
    setEditingId(item._id);
    setTitle(item.title);
    setPoints(
      item.points.map((p) => ({
        pointName: p.pointname,
        status: p.status === "Done",
        deadline: new Date(p.deadline),
      }))
    );
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!title || points.length === 0) {
      alert("Enter title and at least one point");
      return;
    }
    const payload = {
      user_id: USER_ID,
      title,
      points: points.map((p) => ({
        pointName: p.pointName,
        status: p.status,
        deadline: p.deadline.toISOString(),
      })),
    };
    const url = editingId
      ? `${API_URL}/api/items/${editingId}`
      : `${API_URL}/api/items`;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Save failed:", res.status, text);
      alert("Failed to save");
      return;
    }
    alert("Saved!");
    const updated = await fetch(`${API_URL}/api/items`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }).then((r) => r.json());
    setBucketItems(updated);
    setShowForm(false);
    setTitle("");
    setPoints([]);
    setEditingId(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <Image
            source={{ uri: user?.avatar }}
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-xs text-gray-500">Collab</Text>
            <Text className="text-base font-medium text-gray-800">
              {user?.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={icons.bell} className="w-6 h-6" />
        </TouchableOpacity>
      </View>

      {showForm ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: bottomPadding }}
            className="px-5 pt-4"
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={images.onboarding}
              className="w-full h-80 mb-4"
              resizeMode="cover"
            />

            {/* Title */}
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />

            {/* Points */}
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Points
            </Text>
            {points.map((pt, idx) => (
              <View
                key={idx}
                className="border border-gray-300 rounded-lg p-4 mb-4"
              >
                <TextInput
                  value={pt.pointName}
                  onChangeText={(t) => updatePoint(idx, "pointName", t)}
                  placeholder="Point Name"
                  className="border border-gray-300 rounded-lg px-4 py-2 mb-2"
                />
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-700">Status</Text>
                  <Switch
                    value={pt.status}
                    onValueChange={(v) => updatePoint(idx, "status", v)}
                    trackColor={{ false: "#ccc", true: "#4F46E5" }}
                    thumbColor="#fff"
                  />
                </View>
                <Text className="text-sm text-gray-700 mb-1">Deadline</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(idx)}
                  className="border border-gray-300 rounded-lg px-4 py-2 mb-2"
                >
                  <Text>{pt.deadline.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker === idx && (
                  <DateTimePicker
                    value={pt.deadline}
                    mode="date"
                    display="calendar"
                    onChange={(e, d) => onChangeDate(e, d, idx)}
                  />
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={addPoint}
              className="bg-primary-300 px-4 py-2 rounded-lg mb-4"
            >
              <Text className="text-white text-center">Add Point</Text>
            </TouchableOpacity>

            {/* Cancel / Save */}
            <View className="flex-row mb-6">
              <TouchableOpacity
                onPress={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 mr-2 px-4 py-2 bg-red-500 rounded-lg"
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 px-4 py-2 bg-green-500 rounded-lg"
              >
                <Text className="text-white text-center">Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <View
          className="flex-1 px-5 pt-4"
          style={{ paddingBottom: bottomPadding }}
        >
          {bucketItems.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-400 text-lg">
                Your bucket is empty
              </Text>
            </View>
          ) : (
            <FlatList
              data={bucketItems}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingBottom: bottomPadding }}
              renderItem={({ item }) => {
                const total = item.points.length;
                const doneCount = item.points.filter(
                  (p) => p.status === "Done"
                ).length;
                const ratio = total > 0 ? doneCount / total : 0;
                const fillColor =
                  doneCount === total
                    ? "#10B981" // green
                    : doneCount > 0
                    ? "#F97316" // orange
                    : "#EF4444"; // red

                return (
                  <TouchableOpacity
                    onPress={() => handleItemPress(item)}
                    className="rounded-lg shadow mb-4 overflow-hidden"
                    style={{ backgroundColor: fillColor }}
                  >
                    <View className="px-4 py-5">
                      <Text className="font-medium text-lg mb-2 text-white">
                        {item.title}
                      </Text>
                      <Text className="text-sm text-white">
                        {doneCount} of {total} completed
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      )}

      {!showForm && (
        <TouchableOpacity
          onPress={() => {
            setShowForm(true);
            setEditingId(null);
            setTitle("");
            setPoints([]);
          }}
          className="absolute bottom-28 right-6 bg-primary-300 px-5 py-4 rounded-full flex-row items-center justify-center shadow-lg"
        >
          <Text className="text-white text-3xl leading-none">+</Text>
          <Text className="text-white text-base ml-3">Bucket</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
