// app/index.tsx
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

// Import your static assets and custom components.
import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import { useGlobalContext } from "@/lib/global-provider";
import NoResult from "@/components/NoResult";

export default function Index() {
  // Retrieve query and filter parameters from the URL.
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  // Get user data from the global context.
  const { user } = useGlobalContext();

  // Local state for featured (latest) experiences.
  const [latestExperiences, setLatestExperiences] = useState<any[]>([]);
  const [latestLoading, setLatestLoading] = useState<boolean>(true);

  // Local state for filtered experiences.
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Your backend base URL.
  const BASE_URL = "http://192.168.1.198:3000";

  // Hard-coded JWT for quick testing:
  const TEST_JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluX3ZpbGxpeWFtMiIsImlhdCI6MTc0Njk4NTk5MSwiZXhwIjoxNzQ2OTg5NTkxfQ.9PAq3VVncYJFUIoh9VBoWJ2bJ6KjCCsJJ1H4jMr415s";

  // Fetch the latest experiences on mount, using the hard-coded token.
  useEffect(() => {
    async function fetchLatestExperiences() {
      setLatestLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/experience/latest`, {
          headers: {
            Authorization: `Bearer ${TEST_JWT}`,
          },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setLatestExperiences(data);
      } catch (error) {
        console.error("Error fetching latest experiences:", error);
        setLatestExperiences([]);
      }
      setLatestLoading(false);
    }
    fetchLatestExperiences();
  }, []);

  // Fetch experiences whenever the filter or query parameters change, using the hard-coded token.
  useEffect(() => {
    async function fetchExperiences() {
      setLoading(true);
      try {
        const filter = params.filter || "";
        const query = params.query || "";
        const url = `${BASE_URL}/api/experience?filter=${encodeURIComponent(
          filter
        )}&query=${encodeURIComponent(query)}&limit=6`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${TEST_JWT}`,
          },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setExperiences(data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
        setExperiences([]);
      }
      setLoading(false);
    }
    fetchExperiences();
  }, [params.filter, params.query]);

  // Navigate to the experience details screen.
  const handleCardPress = (id: string) => {
    router.push(`/experience/${id}`);
  };

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
        keyExtractor={(item) => item._id?.toString() || ""}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResult />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            {/* Header section with user info */}
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full"
                />
                <View className="ml-2">
                  <Text className="text-xs font-rubik text-black-100">Collab</Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            {/* Search component */}
            <Search />

            {/* Featured experiences section */}
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {latestLoading ? (
                <ActivityIndicator size="large" className="text-primary-300 mt-5" />
              ) : !latestExperiences || latestExperiences.length === 0 ? (
                <NoResult />
              ) : (
                <FlatList
                  data={latestExperiences}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item._id?.toString() || "")}
                    />
                  )}
                  keyExtractor={(item) => item._id?.toString() || ""}
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
            </View>

            {/* Recommended section */}
            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">
                Our Recommendation
              </Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
}
