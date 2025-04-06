import { Link, router, useLocalSearchParams } from "expo-router";
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
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

  // Set your backend URL (update the IP address as needed).

  const BASE_URL = "http://192.168.1.198:3000";

  // Fetch the latest experiences on mount.
  useEffect(() => {
    async function fetchLatestExperiences() {
      setLatestLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/experience/latest`);
        const data = await response.json();
        setLatestExperiences(data);
      } catch (error) {
        console.error("Error fetching latest experiences:", error);
        setLatestExperiences([]);
      }
      setLatestLoading(false);
    }
    fetchLatestExperiences();
  }, []);

  // Fetch experiences whenever the filter or query parameters change.
  useEffect(() => {
    async function fetchExperiences() {
      setLoading(true);
      try {
        const filter = params.filter || "";
        const query = params.query || "";
        const url = `${BASE_URL}/api/experience?filter=${encodeURIComponent(filter)}&query=${encodeURIComponent(query)}&limit=6`;
        const response = await fetch(url);
        const data = await response.json();
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
  const handleCardPress = (id: string) => router.push(`/experience/${id}`);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={experiences} // Data source for the list.
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item._id?.toString())} />
        )}
        // Use the MongoDB _id field as the key.
        keyExtractor={(item) => item._id?.toString() || ""}
        numColumns={2} // Display items in two columns.
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsHorizontalScrollIndicator={false}
        // Display an ActivityIndicator if loading; otherwise, show NoResult if no data.
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResult />
          )
        }
        // List header containing user info, search bar, featured section, filters, etc.
        ListHeaderComponent={
          <View className="px-5">
            {/* Header section with user info */}
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image source={{ uri: user?.avatar }} className="size-12 rounded-full" />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">Collab</Text>
                  <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>
            {/* Search component */}
            <Search />
            {/* Featured experiences section */}
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
                </TouchableOpacity>
              </View>
              {latestLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !latestExperiences || latestExperiences.length === 0 ? (
                <NoResult />
              ) : (
                <FlatList
                  data={latestExperiences}
                  renderItem={({ item }) => (
                    <FeaturedCard item={item} onPress={() => handleCardPress(item._id?.toString())} />
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
              <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
              </TouchableOpacity>
            </View>
            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
}
