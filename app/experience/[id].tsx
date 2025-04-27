// app/experience/[id].tsx
import { useLocalSearchParams, router } from "expo-router";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import icons from "@/constants/icons";
import StaticMap from "@/components/StaticMap";

export default function ExperienceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const EXP_BASE = "http://192.168.1.198:3000";
  const GAL_BASE = "http://192.168.1.198:3000";

  const [exp, setExp] = useState<any>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // 1) Fetch the experience
      const resExp = await fetch(`${EXP_BASE}/api/experience/${id}`);
      const dataExp = await resExp.json();
      setExp(dataExp);

      // 2) Fetch gallery URLs
      const resGal = await fetch(
        `${GAL_BASE}/api/galleries?name=${encodeURIComponent(dataExp.name)}`
      );
      const imgs: string[] = await resGal.json();
      setGallery(imgs);

      setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading || !exp) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const { geolocation } = exp; // expects { latitude: number; longitude: number }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center bg-white px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Image source={icons.backArrow} className="w-6 h-6" />
        </TouchableOpacity>
        <Text className="ml-2 text-lg font-semibold text-gray-800">
          {exp.name}
        </Text>
      </View>

      <ScrollView className="px-4 py-6">
        {/* Main Image */}
        {exp.image && (
          <Image
            source={{ uri: exp.image }}
            className="w-full h-64 rounded-xl mb-6 bg-gray-200"
            resizeMode="cover"
          />
        )}

        {/* Details Title */}
        <Text className="text-2xl font-semibold text-gray-800 mb-4">
          Details
        </Text>

        {/* Description Section */}
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          Description
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          {exp.description}
        </Text>

        {/* Location Section */}
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          Location
        </Text>
        <Text className="text-sm text-gray-500 mb-4">
          {exp.address}
        </Text>

        {/* Static Map */}
        {geolocation && (
          <StaticMap
            lat={geolocation.latitude}
            lng={geolocation.longitude}
            label={exp.name.charAt(0)}
          />
        )}

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <View className="mb-8">
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              Gallery
            </Text>
            <FlatList
              data={gallery}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(uri) => uri}
              contentContainerStyle={{ paddingRight: 16 }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  className="w-64 h-40 rounded-xl mr-4 bg-gray-200"
                  resizeMode="cover"
                />
              )}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
