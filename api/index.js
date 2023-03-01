const express = require('express');
const  {ApolloServer} = require('apollo-server-express');
const { createServer } = require ('http');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const pool = require('./pg/pg');

const typeDefs = require('./schemas');
const resolvers = require('./resolvers');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const app = express();
const MAX_SIZE = '10mb'
app.use(cors('*'));

const httpServer = createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: {
    maxFileSize: MAX_SIZE,
    maxFiles: 1, // Optionnel : nombre maximal de fichiers téléchargés
  },
});
const PORT = 5000;

app.post('/image', upload.single('file'), (req, res) => {
    imageBuffer = req.file.buffer;
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

(async () => {
  await server.start();
  server.applyMiddleware({ app });
  httpServer.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}/graphql`);
  });
})();