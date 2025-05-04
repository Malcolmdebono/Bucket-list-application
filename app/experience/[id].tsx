// app/experience/[id].tsx
import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StaticMap from "@/components/StaticMap";

export default function ExperienceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [exp, setExp]               = useState<any>(undefined);
  const [loadingExp, setLoadingExp] = useState(true);

  const [galImages, setGalImages]   = useState<string[]|null>(null);
  const [loadingGal, setLoadingGal] = useState(false);

  const BASE_URL = "http://192.168.1.198:3000";

  // 1) Fetch the experience by ID
  useEffect(() => {
    if (!id) return;

    async function loadExp() {
      setLoadingExp(true);
      try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluX3ZpbGxpeWFtMiIsImlhdCI6MTc0NjM5ODMzOSwiZXhwIjoxNzQ2NDAxOTM5fQ.0vqMLjpn2ybJweBSbkjSOA_XQOPf9UumAnIMQ5evt1U";
        console.log("→ GET", `${BASE_URL}/api/experience/${id}`, token);
        const res = await fetch(`${BASE_URL}/api/experience/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("← Status", res.status);
        if (res.status === 404) {
          setExp(null);
        } else if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        } else {
          setExp(await res.json());
        }
      } catch (e: any) {
        console.error("Error loading experience:", e);
        setExp(null);
      } finally {
        setLoadingExp(false);
      }
    }

    loadExp();
  }, [id]);

  // 2) Once we have the experience, fetch its gallery
  useEffect(() => {
    if (!exp?.gallery_id) return;

    async function loadGallery() {
      setLoadingGal(true);
      try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluX3ZpbGxpeWFtMiIsImlhdCI6MTc0NjM5NDA5OSwiZXhwIjoxNzQ2Mzk3Njk5fQ.lXr-c3m9hbK5_M7V8cX9WpvTL8CMyB_cL7Wi-gPou9w";
        const url   = `${BASE_URL}/api/galleries?galleryId=${encodeURIComponent(
          exp.gallery_id
        )}`;
        console.log("→ GET", url, token);
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("← Status", res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        setGalImages(await res.json());
      } catch (e) {
        console.error("Error loading gallery:", e);
        setGalImages([]);
      } finally {
        setLoadingGal(false);
      }
    }

    loadGallery();
  }, [exp]);

  // 3) Render loading / errors / not found
  if (loadingExp) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (exp === null) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-gray-500">Experience not found.</Text>
        <Text
          onPress={() => router.back()}
          className="text-primary-300 mt-4 underline"
        >
          Go back
        </Text>
      </View>
    );
  }

  // 4) Success: show detail + gallery
  return (
    <ScrollView className="bg-white flex-1">
      {/* Main image */}
      <Image
        source={{ uri: exp.image }}
        style={{ width: "100%", height: 200 }}
        resizeMode="cover"
      />

      <View className="p-5">
        <Text className="text-2xl font-rubik-medium mb-4">{exp.name}</Text>

        <Text className="text-sm font-rubik-medium mb-1">Description</Text>
        <Text className="mb-4 text-black-500">{exp.description}</Text>

        <Text className="text-sm font-rubik-medium mb-1">Location</Text>
        <Text className="mb-4 text-black-500">{exp.address}</Text>

        {exp.geolocation && (() => {
          const [latStr, lngStr] = exp.geolocation.split(",");
          const lat = parseFloat(latStr.trim());
          const lng = parseFloat(lngStr.trim());

          return (
            <>
            <Text className="text-sm font-rubik-medium mb-1">Map</Text>
            <StaticMap lat={lat} lng={lng} label={exp.name.charAt(0)} />
            </>
          );
        })()}

        <Text className="text-sm font-rubik-medium mb-2">Gallery</Text>
        {loadingGal ? (
          <ActivityIndicator />
        ) : galImages && galImages.length > 0 ? (
          <FlatList
            data={galImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(uri) => uri}
            contentContainerStyle={{ gap: 10, paddingVertical: 5 }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: 120, height: 100, borderRadius: 8 }}
                resizeMode="cover"
              />
            )}
          />
        ) : (
          <Text className="text-gray-500">No images available.</Text>
        )}
      </View>
    </ScrollView>
  );
}
