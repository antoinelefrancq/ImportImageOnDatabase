const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const PORT = 5000;
const app = express();


const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use(cors('*'));
app.use(express.urlencoded({extended: true}));

app.post('/image', upload.single('file'), (req, res) => {
  
  imageBuffer =req.file.buffer;
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('INSERT INTO image (data) VALUES ($1)', [imageBuffer], (err, result) => {
      done();
      if (err) {
        console.log(err);
        res.status(400).send('Failed to insert image into database');
      } else {
        res.status(200).send('Image uploaded successfully');
      }
    });
  });
});

app.get('/get-image/:id', (req, res) => {
  const id = req.params.id;
  const query = {
    text: 'SELECT data FROM image WHERE id = $1',
    values: [id]
  };

  pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving image');
    } else if (result.rowCount === 0) {
      res.status(404).send('Image not found');
    } else {
      res.set('Content-Type', 'image/png');
      const imageBytea = result.rows[0].data; // Les données de l'image récupérées depuis la base de données
      const imageBase64 = Buffer.from(imageBytea).toString('base64'); // Conversion des données de l'image en base64
      const imageUrl = `data:image/png;base64,${imageBase64}`; // Création de l'URL de données de l'image
      res.send(imageUrl);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT} ...`);
});
