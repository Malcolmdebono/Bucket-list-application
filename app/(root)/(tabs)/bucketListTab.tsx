import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { useGlobalContext } from '@/lib/global-provider';

interface Experience {
  _id: string;
  name: string;
  description: string;
  image: string;
}

interface SavedDataEntry {
  _id: string;
  savedExperiences: Experience[];
}

const BucketListTab = () => {
  const { user } = useGlobalContext();
  const [savedExperiences, setSavedExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    if (user) {
      const fetchSavedExperiences = async () => {
        try {
          // Replace this path with your actual API or local data path
          const response = await fetch('/path/to/BucketListDB.SavedExperiences.json');

          if (!response.ok) {
            throw new Error('Failed to fetch saved experiences');
          }

          const savedData: SavedDataEntry[] = await response.json();
          const userSavedExperiences = savedData.find(
            (entry: SavedDataEntry) => entry._id === user.$id
          );

          if (userSavedExperiences) {
            setSavedExperiences(userSavedExperiences.savedExperiences);
          } else {
            setSavedExperiences([]);
          }
        } catch (error) {
          console.error('Error fetching saved experiences:', error);
        }
      };

      fetchSavedExperiences();
    }
  }, [user]);

  return (
    <ScrollView className="p-5 bg-white">
      <Text className="text-xl font-rubik-bold mb-5">My Bucket List</Text>
      {savedExperiences.length === 0 ? (
        <Text>No experiences in your bucket list</Text>
      ) : (
        savedExperiences.map((experience) => (
          <View key={experience._id} className="mb-4 bg-white shadow-md rounded-lg p-3">
            <Image
              source={{ uri: experience.image }}
              style={{
                width: '100%',
                height: 160,
                borderRadius: 10,
                marginBottom: 8,
              }}
            />
            <Text className="text-lg font-rubik-semibold">{experience.name}</Text>
            <Text className="text-sm text-black-100">{experience.description}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default BucketListTab;
