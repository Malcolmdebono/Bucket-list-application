// Import necessary components from react-native and React.
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
// Import hooks from expo-router for accessing URL parameters and path.
import { useLocalSearchParams, usePathname, router } from 'expo-router'

// Import icons from the constants folder.
import icons from '@/constants/icons';
// Import useDebouncedCallback hook from use-debounce library.
import { useDebouncedCallback } from "use-debounce";

// Define the Search component.
const Search = () => {
    // Get the current pathname from the URL.
    const path = usePathname();
    // Retrieve query parameters, specifically 'query', from the URL.
    const params = useLocalSearchParams<{ query?: string }>();
    // Initialize state for search input with the current query parameter.
    const [search, setSearch] = useState(params.query);

    // Create a debounced callback to update URL parameters after 500ms delay.
    const debouncedSearch = useDebouncedCallback((text: string) => router.setParams({ query: text }), 500)

    // Handle search input changes by updating state and triggering the debounced callback.
    const handleSearch = (text: string) => {
        setSearch(text);
        debouncedSearch(text);
    }

    // Render the search bar UI.
    return (
        // Outer container for the search bar, styled as a row with padding, border, and rounded corners.
        <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bh-accent-100 border border-primary-100 mt-5 py-2">
            {/* Container for the search icon and input */}
            <View className="flex-1 flex flex-row items-center justify-start z-50">
                {/* Search icon */}
                <Image source={icons.search} className="size-5" />
                {/* TextInput for search queries */}
                <TextInput
                    value={search}           // Bound to the search state.
                    onChangeText={handleSearch}  // Update search state and URL parameters on change.
                    placeholder="Search for anything"  // Placeholder text.
                    className="text-sm font-rubik text-black-300 ml-2 flex-1"  // Styling for the input.
                />
            </View>
            {/* TouchableOpacity for the filter button */}
            <TouchableOpacity>
                {/* Filter icon */}
                <Image source={icons.filter} className="size-5" />
            </TouchableOpacity>
        </View>
    )
}

// Export the Search component as the default export.
export default Search
