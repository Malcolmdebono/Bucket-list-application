// index.js
require('dotenv').config();
const express    = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors       = require('cors');
const jwt        = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

// --- JWT authentication middleware ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token      = authHeader?.startsWith('Bearer ')
                   ? authHeader.split(' ')[1]
                   : null;
  if (!token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = user; 
    next();
  });
}

async function run() {
  try {
    // 1) Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    const db                   = client.db('BucketListDB');
    const experienceCollection = db.collection('Experience');
    const galleriesCollection  = db.collection('Galleries');
    const bucketListCol         = db.collection('BucketList');
    const bucketListPointsCol   = db.collection('BucketListPoints');

    // 2) Public login endpoint (issue JWT)
    app.post('/api/auth/login', (req, res) => {
      const { username, password } = req.body;
      
      if (username === 'admin_villiyam2' && password === 'Start123x!') {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
      }
      res.status(401).json({ error: 'Invalid credentials' });
    });

    // 3) Protected: latest 5 experiences
    app.get(
      '/api/experience/latest',
      authenticateToken,
      async (req, res) => {
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
      }
    );

    // 4) Protected: list / filter experiences
    app.get(
      '/api/experience',
      authenticateToken,
      async (req, res) => {
        try {
          const filter = req.query.filter || '';
          const query  = req.query.query  || '';
          const limit  = parseInt(req.query.limit) || 6;
          const cond   = {};
          if (filter && filter !== 'All') cond.type = filter;
          if (query) {
            cond.$or = [
              { name:    { $regex: query, $options: 'i' } },
              { address: { $regex: query, $options: 'i' } },
              { type:    { $regex: query, $options: 'i' } }
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
      }
    );

    // 5) Protected: single experience by ID
    app.get(
      '/api/experience/:id',
      authenticateToken,
      async (req, res) => {
        try {
          const exp = await experienceCollection.findOne({
            _id: new ObjectId(req.params.id)
          });
          if (!exp) return res.status(404).json({ error: 'Not found' });
          res.json(exp);
        } catch (e) {
          res.status(500).json({ error: e.message });
        }
      }
    );

    // 6) Protected: gallery images
    app.get(
      '/api/galleries',
      authenticateToken,
      async (req, res) => {
        // Accept either ?galleryId= or ?gallery_id=
        let galleryId = req.query.galleryId || req.query.gallery_id;
        if (!galleryId) {
          return res
            .status(400)
            .json({ error: 'Missing galleryId (or gallery_id) query parameter' });
        }
    
        // If the query param came in as an array, just take the first element
        if (Array.isArray(galleryId)) {
          galleryId = galleryId[0];
        }
    
        try {
          const doc = await galleriesCollection.findOne({
            _id: new ObjectId(galleryId)
          });
          const images = doc?.images || [];
          res.json(images);
        } catch (e) {
          res.status(500).json({ error: e.message });
        }
      }
    );

    //extra for post mybucket

    app.post("/api/items", authenticateToken, async (req, res) => {
      try {
        const { user_id, title, points } = req.body;
    
        // 1) Validate presence/types
        if (
          !user_id ||
          typeof title !== "string" ||
          !Array.isArray(points) ||
          points.length === 0
        ) {
          return res.status(400).json({ error: "Bad request body" });
        }
    
        // 2) Convert user_id to ObjectId
        const ownerId = new ObjectId(user_id);
    
        // 3) Prepare point documents (map boolean->string for status)
        const toInsert = points.map((p) => ({
          pointname: p.pointName,
          status:    p.status ? "Done" : "Pending",
          deadline:  new Date(p.deadline),
        }));
    
        // 4) Insert points, bypassing validation temporarily
        let insertPts;
        try {
          insertPts = await bucketListPointsCol.insertMany(toInsert, {
            bypassDocumentValidation: true
          });
        } catch (err) {
          console.error("Point insert writeErrors:", err.errorResponse.writeErrors);
          throw err;
        }
        const pointIds = Object.values(insertPts.insertedIds);
    
        // 5) Insert the bucket‐list document
        const bucketDoc = {
          user_id:          ownerId,
          title,
          bucketlistpoints: pointIds,
        };
        const { insertedId } = await bucketListCol.insertOne(bucketDoc);
    
        // 6) Lookup + return the newly‐created item
        const [newItem] = await bucketListCol
          .aggregate([
            { $match: { _id: insertedId } },
            {
              $lookup: {
                from:         "BucketListPoints",
                localField:   "bucketlistpoints",
                foreignField: "_id",
                as:           "points",
              },
            },
            {
              $project: {
                title: 1,
                points: {
                  $map: {
                    input: "$points",
                    as:    "p",
                    in: {
                      pointname: "$$p.pointname",
                      status:    "$$p.status",
                      deadline:  "$$p.deadline",
                    },
                  },
                },
              },
            },
          ])
          .toArray();
    
        res.status(201).json(newItem);
      } catch (err) {
        console.error("POST /api/items error:", err);
        res.status(500).json({ error: err.message });
      }
    });
    


    //extra for mybucket tab
    app.get("/api/items", authenticateToken, async (req, res) => {
      try {
        // Pull in every bucket-list doc…
        const items = await bucketListCol.aggregate([
          {
            $lookup: {
              from: "BucketListPoints",
              localField: "bucketlistpoints",
              foreignField: "_id",
              as: "points",
            },
          },
          {
            $project: {
              title: 1,
              points: {
                $map: {
                  input: "$points",
                  as: "p",
                  in: {
                    pointname: "$$p.pointname",
                    status:    "$$p.status",
                    deadline:  "$$p.deadline",
                  },
                },
              },
            },
          },
        ]).toArray();
    
        res.json(items);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });

    //put api for mybucket
    // UPDATE an existing bucket-list
// inside your `run()` function, after bucketListCol & bucketListPointsCol are defined

app.put("/api/items/:id", authenticateToken, async (req, res) => {
  try {
    const id     = new ObjectId(req.params.id);
    const { title, points } = req.body;

    // 1) Basic validation
    if (typeof title !== "string" || !Array.isArray(points)) {
      return res.status(400).json({ error: "Bad request body" });
    }

    // 2) Remove old points
    const old = await bucketListCol.findOne({ _id: id });
    if (old?.bucketlistpoints) {
      await bucketListPointsCol.deleteMany({
        _id: { $in: old.bucketlistpoints },
      });
    }

    // 3) Prepare new point docs, converting status → string
    const toInsert = points.map((p) => ({
      pointname: p.pointName,
      status:    p.status ? "Done" : "Pending",
      deadline:  new Date(p.deadline),
    }));

    // 4) Insert them, bypassing validation so we can debug
    let insertPts;
    try {
      insertPts = await bucketListPointsCol.insertMany(toInsert, {
        bypassDocumentValidation: true
      });
    } catch (err) {
      console.error("PUT insertMany writeErrors:", err.errorResponse.writeErrors);
      throw err;
    }
    const newIds = Object.values(insertPts.insertedIds);

    // 5) Update the bucket-list doc
    await bucketListCol.updateOne(
      { _id: id },
      {
        $set: {
          title,
          bucketlistpoints: newIds,
        },
      }
    );

    // 6) Lookup & return the updated item
    const [updatedItem] = await bucketListCol.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from:         "BucketListPoints",
          localField:   "bucketlistpoints",
          foreignField: "_id",
          as:           "points",
        },
      },
      {
        $project: {
          title: 1,
          points: {
            $map: {
              input: "$points",
              as:    "p",
              in: {
                pointname: "$$p.pointname",
                status:    "$$p.status",
                deadline:  "$$p.deadline",
              },
            },
          },
        },
      },
    ]).toArray();

    res.json(updatedItem);
  } catch (err) {
    console.error("PUT /api/items/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

    

    // 7) Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server is running on port ${port}`));

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run().catch(console.dir);
