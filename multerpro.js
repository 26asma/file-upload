const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set the views directory to 'templates'
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir); // Specify folder where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set file name as timestamp to avoid overwriting
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single('image'); // Handle single file upload

// Serve the HTML page with the upload form and gallery
app.get('/', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) throw err;
    res.render('index', { files }); // Render HTML with images from the new 'templates' directory
  });
});
app.use('/uploads', express.static('uploads'));

// Upload image route
app.post('/upload', upload, (req, res) => {
  if (req.file) {
    res.redirect('/'); // Redirect to home after upload
  } else {
    res.send('No file uploaded.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
