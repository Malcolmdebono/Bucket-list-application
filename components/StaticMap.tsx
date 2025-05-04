// components/StaticMap.tsx
import { Image, TouchableOpacity, Linking } from "react-native";

const API_KEY = "AIzaSyDuvKWkFckZjauPohn-Gf6JczVwJ-NRnSA";

export default function StaticMap({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label?: string;
}) {
  // Build marker param—omit “label:” when there's no label
  const markerParam = label
    ? `&markers=color:red%7Clabel:${encodeURIComponent(label)}%7C${lat},${lng}`
    : `&markers=color:red%7C${lat},${lng}`;

  const url =
    `https://maps.googleapis.com/maps/api/staticmap` +
    `?center=${lat},${lng}` +
    `&zoom=14` +
    `&size=600x300` +
    `&scale=2` +            // optional, for 2× resolution
    markerParam +
    `&key=${API_KEY}`;

  // (for debugging—remove in production)
  console.log("StaticMap URL:", url);

  return (
    <TouchableOpacity
      onPress={() =>
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        )
      }
      style={{ borderRadius: 8, overflow: "hidden", marginBottom: 16 }}
    >
      <Image
        source={{ uri: url }}
        style={{ width: "100%", height: 200, backgroundColor: "#eee" }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}
