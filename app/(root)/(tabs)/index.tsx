// Import necessary functions and components from expo-router and react-native libraries.
import { Link, router, useLocalSearchParams } from "expo-router";
import { Text, View, Image, TouchableOpacity, FlatList, Button, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import static assets, custom components, and helper functions.
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

// Define and export the main component for the Index screen.
export default function Index() {
  // Retrieve query and filter parameters from the URL .
  const params = useLocalSearchParams<{ query?: string; filter?: string; }>();

  // Get user data from the global context (e.g., user avatar and name).
  const { user } = useGlobalContext();

  // Use the custom hook to fetch the latest.
  const { data: latestProperties, loading: latestPropertiesLoading } = useAppwrite({
    fn: getLatestProperties
  });

  // Use the custom useAppwrite hook to fetch properties based on search/filter parameters.
  // 'skip: true' prevents automatic fetching until explicitly triggered.
  const { data: properties, loading, refetch } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  });

  // Define a handler for when a property card is pressed; navigates to the property details screen.
  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  // useEffect hook to re-fetch properties whenever the filter or query parameters change.
  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6
    });
  }, [params.filter, params.query]);

  // Render the Index screen UI.
  return (
    // SafeAreaView ensures that content is rendered within safe boundaries on various devices.
    <SafeAreaView className="bg-white h-full">
      {/* FlatList is used to render a grid/list of cards */}
      <FlatList
        data={properties} // Data source for the list
        // Render each Card component and assign onPress handler.
        renderItem={({ item }) => <Card item={item} onPress={() => handleCardPress(item.$id)} />}
        // Create unique keys for each property using its toString() method.
        keyExtractor={(item) => item.toString()}
        numColumns={2} // Display items in two columns
        contentContainerClassName="pb-32" // Padding bottom for the list container
        columnWrapperClassName="flex gap-5 px-5" // Style for the row wrapper of each column
        showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
        // Show an activity indicator if loading; otherwise show the NoResult component if no data.
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : <NoResult />
        }
        // Define a header component for the FlatList, including user info, search bar, filters, and featured content.
        ListHeaderComponent={
          <View className="px-5">
            {/* Header section with user info and back button */}
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                {/* Display user's avatar */}
                <Image source={{ uri: user?.avatar }} className="size-12 rounded-full" />
                <View className="flex flex-col items-start ml-2 justify-center">
                  {/* Display user's role or label */}
                  <Text className="text-xs font-rubik text-black-100">Collab</Text>
                  {/* Display user's name */}
                  <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
                </View>
              </View>
              {/* Notification icon */}
              <Image source={icons.bell} className="size-6" />
            </View>
            {/* Render the Search component */}
            <Search />
            {/* Section for featured */}
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                {/* Section title */}
                <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                {/* "See All" button */}
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
                </TouchableOpacity>
              </View>
              {/* If loading, show ActivityIndicator; if no featured , show NoResult; otherwise render a horizontal FlatList of featured cards */}
              {latestPropertiesLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !latestProperties || latestProperties.length === 0 ? (
                <NoResult />
              ) : (
                <FlatList
                  data={latestProperties}
                  renderItem={({ item }) => <FeaturedCard item={item} onPress={() => handleCardPress(item.$id)} />}
                  keyExtractor={(item) => item.toString()}
                  horizontal // Render horizontally
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
            </View>
            {/* Section for recommended  */}
            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
              </TouchableOpacity>
            </View>
            {/* Render the Filters component */}
            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
}
