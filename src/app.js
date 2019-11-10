require('dotenv').config({ path: '../.env' });
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
const db = require('./database/index');

// Enable files upload
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024 * 1024 //10MB max file(s) size
    }
  })
);

// Middlewares
app.use(cors());
app.use(express.json());

// Import routes
const reportsRoutes = require('./routes/reports');
app.use('/reports', reportsRoutes);
app.get('/', (req, res) => {
  res.send('Home Page');
});

// Start App
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
