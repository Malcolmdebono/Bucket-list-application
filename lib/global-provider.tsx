// Import necessary modules and types from React.
import React, { createContext, useContext, ReactNode } from "react";

// Import the getCurrentUser function from appwrite module.
import { getCurrentUser } from "./appwrite";
// Import the custom useAppwrite hook for handling API calls.
import { useAppwrite } from "./useAppwrite";
// Import Redirect from expo-router for navigation purposes.
import { Redirect } from "expo-router";

// Define a User interface representing the structure of a user object.
interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

// Define the GlobalContextType interface for our global context,
// including authentication state, user data, loading state, and a refetch function.
interface GlobalContextType {
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

// Create a GlobalContext with an initial undefined value.
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Define the GlobalProvider component to wrap the app and provide global context.
export const GlobalProvider = ({ children }: { children: ReactNode}) => {
  // Use the custom useAppwrite hook to fetch the current user.
  const {
    data: user,
    loading,
    refetch,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  // Determine if a user is logged in based on whether user data is available.
  const isLoggedIn = !!user;

  // Provide the global context values to child components.
  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to consume the global context.
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  // Ensure the hook is used within a GlobalProvider.
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

// Export the GlobalProvider as the default export.
export default GlobalProvider;
