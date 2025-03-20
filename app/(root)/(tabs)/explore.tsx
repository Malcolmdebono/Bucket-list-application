// Import necessary functions and components from expo-router and react-native libraries.
import { Link, router, useLocalSearchParams } from "expo-router";
import { Text, View, Image, TouchableOpacity, FlatList, Button, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import static assets and custom components.
import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import { useGlobalContext } from "@/lib/global-provider";
import seed from "@/lib/seed";
import { useAppwrite } from "@/lib/useAppwrite";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useEffect } from "react";
import NoResult from "@/components/NoResult";

// Define and export the Explore component.
export default function Explore() {
  // Retrieve search parameters (query and filter) from the URL using expo-router hook.
  const params = useLocalSearchParams<{ query?: string; filter?: string; }>();

  // Use the custom hook to fetch data with given parameters.
  // 'skip: true' is used to avoid an initial automatic fetch.
  const { data: properties, loading, refetch } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  });

  // Function to handle card press events, navigating to the property details page.
  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  // useEffect hook to trigger refetch when the filter or query parameters change.
  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 20,
    });
  }, [params.filter, params.query]);

  // Render the UI components for the Explore screen.
  return (
    // SafeAreaView ensures the content is rendered within safe boundaries on devices.
    <SafeAreaView className="bg-white h-full">
      {/* FlatList used to render a list/grid of property cards */}
      <FlatList
        data={properties}
        // Render each item using the Card component, passing the item and onPress event handler.
        renderItem={({ item }) => <Card item={item} onPress={() => handleCardPress(item.$id)} />}
        // Generate unique keys for each item.
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsHorizontalScrollIndicator={false}
        // Display an ActivityIndicator when loading; otherwise, show NoResult component.
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : <NoResult />
        }
        // Header component for the FlatList that includes a back button, title, search bar, and filters.
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              {/* Back button to navigate to the previous screen */}
              <TouchableOpacity onPress={() => router.back()} className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center">
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              {/* Header title */}
              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Find New Experiences
              </Text>

              {/* Bell icon (possibly for notifications) */}
              <Image source={icons.bell} className="w-6 h-6" />
            </View>
            {/* Render the Search component */}
            <Search />

            <View className="mt-5">
              {/* Render the Filters component */}
              <Filters />

              {/* Display the number of experiences found */}
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {properties?.length} Experiences
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
