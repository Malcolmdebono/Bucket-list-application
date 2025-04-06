// index.js
require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("BucketListDB");
    // Use the "Experience" collection instead of "properties"
    const experienceCollection = database.collection("Experience");

    // Endpoint: Get the latest 5 experiences (ascending order by createdAt)
    app.get('/api/experience/latest', async (req, res) => {
      try {
        const latestExperiences = await experienceCollection
          .find({})
          .sort({ createdAt: 1 })
          .limit(5)
          .toArray();
        res.json(latestExperiences);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Endpoint: Get experiences with optional filter, query, and limit
    app.get('/api/experience', async (req, res) => {
      try {
        const filter = req.query.filter || "";
        const query = req.query.query || "";
        const limit = parseInt(req.query.limit) || 6;

        const queryConditions = {};

        // Add filter condition if provided and not "All"
        if (filter && filter !== "All") {
          queryConditions.type = filter;
        }

        // Add search conditions if query is provided
        if (query) {
          queryConditions.$or = [
            { name: { $regex: query, $options: "i" } },
            { address: { $regex: query, $options: "i" } },
            { type: { $regex: query, $options: "i" } }
          ];
        }

        const experiences = await experienceCollection
          .find(queryConditions)
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray();

        res.json(experiences);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);
