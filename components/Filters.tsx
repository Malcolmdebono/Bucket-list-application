// Import necessary components and hooks from react-native and expo-router.
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
// Import categories data from constants.
import { categories } from '@/constants/data';

// Define the Filters component.
const Filters = () => {
    // Retrieve the filter parameter from the URL using useLocalSearchParams.
    // Initialize selectedCategory state with the filter parameter or default to 'All'.
    const params = useLocalSearchParams<{ filter?: string }>();
    const [selectedCategory, setSelectedCategory] = useState(params.filter || 'All');

    // Handler function for when a category is pressed.
    const handleCategoryPress = (category: string) => {
        // If the currently selected category is pressed again, reset to 'All'.
        if (selectedCategory === category) {
            setSelectedCategory('All');
            router.setParams({ filter: 'All' });
            return;
        }
        // Otherwise, set the selected category and update the URL parameter.
        setSelectedCategory(category);
        router.setParams({ filter: category });
    }

    // Render a horizontal scrollable list of category buttons.
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 mb-2">
            {categories.map((item, index) => (
                // Each category is rendered as a TouchableOpacity.
                // The key is set using the index.
                <TouchableOpacity
                    key={index}
                    onPress={() => handleCategoryPress(item.category)}
                    // Conditionally set the background and border styles based on the selected category.
                    className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full
                        ${selectedCategory === item.category ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}
                    `}
                >
                    {/* Render the category title with conditional text styling. */}
                    <Text className={`text-sm ${selectedCategory === item.category ? 'text-white font-rubik-bold mt-0.5' : 'text-black-300 font-rubik'}`}>
                        {item.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

// Export the Filters component as the default export.
export default Filters
