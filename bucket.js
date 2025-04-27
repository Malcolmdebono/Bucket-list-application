require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("BucketListDB");
    const usersCollection = database.collection("Users");
    const itemsCollection = database.collection("Items"); // Or "Experience" if you prefer

    // API: Get items with user_id
    app.get('/api/items', async (req, res) => {
      try {
        const userId = req.query.user_id;

        if (!userId) {
          return res.status(400).json({ error: 'user_id is required' });
        }

        // Find the user first (optional, if you want to validate user exists)
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Fetch items belonging to this user
        const items = await itemsCollection.find({ user_id: userId }).toArray();

        // Map the required fields only
        const formattedItems = items.map(item => ({
          _id: item._id,
          user_id: item.user_id,
          item_id: item.item_id,
          name: item.name,
          type: item.type,
          description: item.description,
          price: item.price,
          rating: item.rating,
          image: item.image,
          address: item.address,
          geolocation: item.geolocation,
        }));

        res.json(formattedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: error.message });
      }
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);
