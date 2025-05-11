// app/explore.tsx
import { router, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

// Import static assets and custom components.
import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card } from "@/components/Cards";
import Filters from "@/components/Filters";
import { useGlobalContext } from "@/lib/global-provider";
import NoResult from "@/components/NoResult";

export default function Explore() {
  // Retrieve search parameters (query and filter) from the URL.
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const { user } = useGlobalContext();

  // Local state for experiences.
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Your backend base URL.
  const BASE_URL = "http://192.168.1.198:3000";

  // Hard-coded JWT for quick testing
  const TEST_JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluX3ZpbGxpeWFtMiIsImlhdCI6MTc0Njk4NTk5MSwiZXhwIjoxNzQ2OTg5NTkxfQ.9PAq3VVncYJFUIoh9VBoWJ2bJ6KjCCsJJ1H4jMr415s";

  // Function to fetch experiences from your backend.
  async function fetchExperiences(filter: string, query: string, limit: number) {
    setLoading(true);
    try {
      const url = `${BASE_URL}/api/experience?filter=${encodeURIComponent(
        filter
      )}&query=${encodeURIComponent(query)}&limit=${limit}`;
      console.log("Fetching experiences from:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${TEST_JWT}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setExperiences([]);
    }
    setLoading(false);
  }

  // Fetch experiences when the filter or query parameters change.
  useEffect(() => {
    const filter = params.filter || "";
    const query = params.query || "";
    // In this example, we're using a limit of 20 on re-fetch.
    fetchExperiences(filter, query, 20);
  }, [params.filter, params.query]);

  // Navigate to the experience detail screen.
  const handleCardPress = (id: string) =>
    router.push(`/experience/${id}`);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={experiences}
        renderItem={({ item }) => (
          <Card
            item={item}
            onPress={() => handleCardPress(item._id?.toString() || "")}
          />
        )}
        // Use the MongoDB _id field as the key.
        keyExtractor={(item) => item._id?.toString() || ""}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsHorizontalScrollIndicator={false}
        // Display an ActivityIndicator if loading; otherwise, show NoResult if no data.
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              className="text-primary-300 mt-5"
            />
          ) : (
            <NoResult />
          )
        }
        // Header component for the FlatList including back button, title, search bar, filters, etc.
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              {/* Back button */}
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              {/* Header title */}
              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Find New Experiences
              </Text>

              {/* Bell icon */}
              <Image source={icons.bell} className="w-6 h-6" />
            </View>
            {/* Search component */}
            <Search />
            <View className="mt-5">
              {/* Filters component */}
              <Filters />
              {/* Display the number of experiences found */}
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {experiences.length} Experiences
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
