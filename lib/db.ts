// db.ts
import { MongoClient, Db } from "mongodb";

const uri = "mongodb+srv://vladimiriliev05:N8u1H7Neo00S9xlE@bucketlistcluster.9pmvm.mongodb.net/?retryWrites=true&w=majority&appName=BucketListCluster";
const client = new MongoClient(uri);

let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;
  await client.connect();
  cachedDb = client.db("BucketListDB");
  console.log("Connected to MongoDB");
  return cachedDb;
}

/**
 * Fetch the latest 5 properties sorted by creation date in ascending order.
 */
export async function getLatestProperties() {
  try {
    const db = await connectToDatabase();
    const properties = await db
      .collection("properties")
      .find({})
      .sort({ createdAt: 1 }) // ascending order
      .limit(5)
      .toArray();
    return properties;
  } catch (error) {
    console.error("Error fetching latest properties:", error);
    return [];
  }
}

/**
 * Fetch properties based on filter, query, and an optional limit.
 */
export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const db = await connectToDatabase();
    const queryConditions: any = {};

    // Add filter condition if applicable
    if (filter && filter !== "All") {
      queryConditions.type = filter;
    }

    // Add search conditions if a query string is provided
    if (query) {
      queryConditions.$or = [
        { name: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } },
      ];
    }

    let cursor = db.collection("properties")
      .find(queryConditions)
      .sort({ createdAt: -1 }); // descending order

    if (limit) {
      cursor = cursor.limit(limit);
    }

    const properties = await cursor.toArray();
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}
