const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://shubham4835:destro1234@cluster0.zwbi0te.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define Schema and Model
const profileSchema = new mongoose.Schema({
  username: String,
  currentPassword: String,
  newPassword: String,
  profession: String,
  companyName: String,
  addressLine1: String,
  country: String,
  state: String,
  city: String,
  subscriptionPlan: String,
  newsletter: Boolean,
  photoFilename: String,
});

const Profile = mongoose.model('Profile', profileSchema);

// Setup multer for file uploads (save files to /uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Save with unique name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Create uploads folder if doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// POST route to save profile
app.post('/api/update-profile', upload.single('photo'), async (req, res) => {
  try {
    const {
      username,
      currentPassword,
      newPassword,
      profession,
      companyName,
      addressLine1,
      country,
      state,
      city,
      subscriptionPlan,
      newsletter,
    } = req.body;

    const profile = new Profile({
      username,
      currentPassword,
      newPassword,
      profession,
      companyName,
      addressLine1,
      country,
      state,
      city,
      subscriptionPlan,
      newsletter: newsletter === 'true',
      photoFilename: req.file ? req.file.filename : null,
    });

    await profile.save();

    res.json({ success: true, message: 'Profile saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
