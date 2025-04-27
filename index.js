// index.js
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
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("BucketListDB");
    const experienceCollection = database.collection("Experience");
    const galleriesCollection  = database.collection("Galleries");

    // GET latest 5 experiences
    app.get('/api/experience/latest', async (req, res) => {
      try {
        const latest = await experienceCollection
          .find({})
          .sort({ createdAt: 1 })
          .limit(5)
          .toArray();
        res.json(latest);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // GET experiences with optional filter, query, limit
    app.get('/api/experience', async (req, res) => {
      try {
        const filter = req.query.filter || "";
        const query  = req.query.query  || "";
        const limit  = parseInt(req.query.limit) || 6;

        // Removed ": any" annotation so this is valid JS
        const cond = {};
        if (filter && filter !== "All") cond.type = filter;
        if (query) {
          cond.$or = [
            { name:    { $regex: query, $options: "i" } },
            { address: { $regex: query, $options: "i" } },
            { type:    { $regex: query, $options: "i" } }
          ];
        }

        const items = await experienceCollection
          .find(cond)
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray();
        res.json(items);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // GET one experience by ID
    app.get('/api/experience/:id', async (req, res) => {
      try {
        const exp = await experienceCollection.findOne({
          _id: new ObjectId(req.params.id)
        });
        if (!exp) return res.status(404).json({ error: "Not found" });
        res.json(exp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // GET gallery images by experience name (flattened images[])
    app.get('/api/galleries', async (req, res) => {
      try {
        const name = req.query.name || "";
        const docs = await galleriesCollection
          .find({ name: name })
          .toArray();
        // flatten all docs’ images arrays
        const allImages = docs.flatMap(d => d.images || []);
        res.json(allImages);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // Start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));

  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

run().catch(console.dir);
