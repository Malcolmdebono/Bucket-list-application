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
  const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}` +
              `&zoom=14&size=600x300&markers=color:red%7Clabel:${label || ""}%7C${lat},${lng}` +
              `&key=${API_KEY}`;

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
