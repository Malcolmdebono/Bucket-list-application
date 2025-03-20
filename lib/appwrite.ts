// Import necessary modules from react-native-appwrite for API calls and OAuth.
import { Account, Avatars, Client, Databases, OAuthProvider, Query } from "react-native-appwrite";
// Import Linking from expo-linking to handle URL creation.
import * as Linking from 'expo-linking';
// Import openAuthSessionAsync from expo-web-browser to open authentication sessions in the browser.
import { openAuthSessionAsync } from "expo-web-browser";

// Define the configuration object for Appwrite endpoints and project/database/collection IDs.
export const config = {
    platform: 'com.collab.bucketlist',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
    galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
    reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
    propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
}

// Create a new Appwrite Client instance.
export const client = new Client();

// Configure the client with the endpoint, project, and platform.
client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!)

// Instantiate Appwrite service objects for avatars, account management, and databases.
export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

// Define the login function using OAuth2 with Google.
export async function login() {
    try {
        // Create a redirect URI using Expo Linking.
        const redirectUri = Linking.createURL('/');
        // Initiate OAuth2 token creation for Google sign-in.
        const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri);

        // If no response is received, throw an error.
        if (!response) throw new Error('Failed to login');

        // Open an authentication session in the browser using the URL from response.
        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        );

        // If the browser session does not succeed, throw an error.
        if (browserResult.type != 'success') throw new Error('Failed to login');

        // Parse the URL returned from the browser to extract parameters.
        const url = new URL(browserResult.url);

        // Extract 'secret' and 'userId' from the query parameters.
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        // If either secret or userId is missing, throw an error.
        if (!secret || !userId) throw new Error('Faield to login');

        // Create a new session in Appwrite using the extracted userId and secret.
        const session = await account.createSession(userId, secret);

        // If session creation fails, throw an error.
        if (!session) throw new Error('Failed to create session');

        // Return true if login and session creation were successful.
        return true;

    } catch (error) {
        // Log any errors to the console and return false.
        console.error(error);
        return false;
    }
}

// Define the logout function to delete the current session.
export async function logout() {
    try {
        // Delete the current session.
        await account.deleteSession('current');
        return true;
    } catch (error) {
        // Log any errors to the console and return false.
        console.error(error);
        return false;
    }
}

// Define a function to get the current user from Appwrite.
export async function getCurrentUser() {
    try {
        // Attempt to retrieve the user account.
        const response = await account.get();

        // If a valid user ID is found, get the user's avatar initials.
        if (response.$id) {
            const userAvatar = avatar.getInitials(response.name);
            // Return the user object along with the generated avatar.
            return {
                ...response,
                avatar: userAvatar.toString(),
            }
        }

    } catch (error) {
        // Log errors and return null if unable to fetch user data.
        console.error(error);
        return null;
    }
}

// Define a function to get the latest properties from the properties collection.
export async function getLatestProperties() {
    try {
        // Query the properties collection with ascending order on creation date and limit to 5 documents.
        const result = await databases.listDocuments(
            config.databaseId!,
            config.propertiesCollectionId!,
            [Query.orderAsc('$createdAt'), Query.limit(5)]
        );

        // Return the documents retrieved.
        return result.documents;
    } catch (error) {
        // Log errors and return an empty array if the query fails.
        console.error(error);
        return [];
    }
}

// Define a function to get properties based on filter, query, and limit.
export async function getProperties({ filter, query, limit }: {
    filter: string;
    query: string;
    limit?: number;
}) {
    try {
        // Start building the query with a descending order by creation date.
        const buildQuery = [Query.orderDesc('$createdAt')];

        // If a specific filter is set and is not 'All', add a query condition to match the type.
        if (filter && filter != 'All') {
            buildQuery.push(Query.equal('type', filter));
        }
        
        // If a query string is provided, add search conditions for name, address, and type.
        if (query) {
            buildQuery.push(
                Query.or([
                    Query.search('name', query),
                    Query.search('address', query),
                    Query.search('type', query)
                ])
            )
        }

        // If a limit is provided, add a limit condition.
        if (limit) buildQuery.push(Query.limit(limit));

        // Query the properties collection using the built query.
        const result = await databases.listDocuments(
            config.databaseId!,
            config.propertiesCollectionId!,
            buildQuery,
        );

        // Return the documents retrieved.
        return result.documents;
    } catch (error) {
        // Log errors and return an empty array if the query fails.
        console.error(error);
        return [];
    }
}
