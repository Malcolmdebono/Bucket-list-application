const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB Atlas URI with credentials
const uri = "mongodb+srv://vladimiriliev05:N8u1H7Neo00S9xlE@bucketlistcluster.9pmvm.mongodb.net/?retryWrites=true&w=majority&appName=BucketListCluster";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connecting the client to the server
        await client.connect();

        // Sending a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Access a specific database (replace 'your_database_name' with the actual database name)
        const database = client.db("BucketListDB");  // Replace "BucketList" with database name
        const collection = database.collection("items");  // Replace "items" with collection name

        // Example: Inserting a document into the collection
        const result = await collection.insertOne({
            name: "Skydiving", 
            description: "Jump from an airplane!", 
            completed: false,
            dateAdded: new Date()
        });
        console.log(`Document inserted with ID: ${result.insertedId}`);

        // Example: Finding and logging all documents in the collection
        const allItems = await collection.find({}).toArray();
        console.log("All items in the collection:", allItems);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // Ensures that the client will close when finished/error
        await client.close();
    }
}

run().catch(console.dir);

