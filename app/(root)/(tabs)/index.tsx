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

import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import { useGlobalContext } from "@/lib/global-provider";
import NoResult from "@/components/NoResult";

export default function Index() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const { user } = useGlobalContext();

  const [latestExperiences, setLatestExperiences] = useState<any[]>([]);
  const [latestLoading, setLatestLoading]       = useState(true);
  const [experiences, setExperiences]           = useState<any[]>([]);
  const [loading, setLoading]                   = useState(true);

  const BASE_URL = "http://192.168.1.198:3000";

  useEffect(() => {
    async function fetchLatest() {
      setLatestLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/experience/latest`);
        setLatestExperiences(await res.json());
      } catch {
        setLatestExperiences([]);
      }
      setLatestLoading(false);
    }
    fetchLatest();
  }, []);

  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      const filter = params.filter || "";
      const query  = params.query  || "";
      const url    = `${BASE_URL}/api/experience?filter=${encodeURIComponent(
        filter
      )}&query=${encodeURIComponent(query)}&limit=6`;
      try {
        const res = await fetch(url);
        setExperiences(await res.json());
      } catch {
        setExperiences([]);
      }
      setLoading(false);
    }
    fetchList();
  }, [params.filter, params.query]);

  // <-- Here’s the fix: push to /experience/:id so it matches app/experience/[id].tsx
  const handleCardPress = (id: string) => {
    router.push(`/experience/${id}`);
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={experiences}
        numColumns={2}
        columnWrapperClassName="flex gap-5 px-5"
        contentContainerClassName="pb-32"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id?.toString() || ""}
        renderItem={({ item }) => (
          <Card
            item={item}
            onPress={() => handleCardPress(item._id?.toString() || "")}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="mt-5" />
          ) : (
            <NoResult />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            {/* User header */}
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full"
                />
                <View className="ml-2">
                  <Text className="text-xs font-rubik text-black-100">
                    Collab
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            {/* Search bar */}
            <Search />

            {/* Featured section */}
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
                <ActivityIndicator size="large" className="mt-5" />
              ) : latestExperiences.length === 0 ? (
                <NoResult />
              ) : (
                <FlatList
                  data={latestExperiences}
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                  keyExtractor={(item) => item._id?.toString() || ""}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() =>
                        handleCardPress(item._id?.toString() || "")
                      }
                    />
                  )}
                />
              )}
            </View>

            {/* Recommendation section */}
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

            {/* Filters */}
            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
}
