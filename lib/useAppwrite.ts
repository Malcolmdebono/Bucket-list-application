// Import necessary modules: Alert for error display, and hooks from React.
import { Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";

// Define the interface for options passed to useAppwrite hook.
// T is the type of data returned, and P is a record of parameters (string or number).
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>; // Function to fetch data, which accepts parameters and returns a Promise.
  params?: P;                   // Optional initial parameters for the function.
  skip?: boolean;               // Flag to skip the initial fetch if true.
}

// Define the interface for the value returned by the useAppwrite hook.
interface UseAppwriteReturn<T, P> {
  data: T | null;                            // The fetched data or null.
  loading: boolean;                          // Loading state of the fetch operation.
  error: string | null;                      // Error message, if any.
  refetch: (newParams: P) => Promise<void>;    // Function to refetch data with new parameters.
}

// Define the useAppwrite custom hook, parameterized over types T and P.
export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,                    // The function to fetch data.
  params = {} as P,      // Initial parameters, defaulting to an empty object.
  skip = false,          // Whether to skip the initial fetch.
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  // State to hold the fetched data.
  const [data, setData] = useState<T | null>(null);
  // State to indicate if data is currently loading.
  const [loading, setLoading] = useState(!skip);
  // State to hold any error message encountered during fetch.
  const [error, setError] = useState<string | null>(null);

  // Define a function to fetch data, using useCallback to memoize the function.
  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);   // Set loading state to true before starting fetch.
      setError(null);     // Clear any previous error.

      try {
        const result = await fn(fetchParams); // Call the provided function with fetch parameters.
        setData(result); // Update state with fetched data.
      } catch (err: unknown) {
        // Determine an error message from the caught error.
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);  // Update error state.
        Alert.alert("Error", errorMessage);  // Show an alert with the error message.
      } finally {
        setLoading(false); // Set loading state to false after fetch completes.
      }
    },
    [fn] // Dependency array ensures fetchData only changes when fn changes.
  );

  // useEffect to run fetchData on component mount, if not skipped.
  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []); // Empty dependency array to run only once on mount.

  // Define the refetch function to allow re-fetching with new parameters.
  const refetch = async (newParams: P) => await fetchData(newParams);

  // Return the data, loading state, error, and refetch function.
  return { data, loading, error, refetch };
};
