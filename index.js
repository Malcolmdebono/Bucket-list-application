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

    // 6) (Optional) Protected: gallery images
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

    // 7) Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server is running on port ${port}`));

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run().catch(console.dir);
