const express = require('express');
const mongoose = require('mongoose');
var hateoasLinker = require('express-hateoas-links');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const historiqueRoutes = require('./routes/historique');
const seed = require('./routes/db');
const config = require('./config');

const app = express();
const PORT = config.PORT;
const MONGO_URL = config.MONGO_URL

// parse application/json
app.use(express.json());  

// remplace le res.json standard avec la nouvelle version
// qui prend en charge les liens HATEOAS
app.use(hateoasLinker); 


app.use(
  cors({
    origin: 'http://localhost:5173', // Allow all origins (you can replace '*' with your frontend's URL)
    methods: 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  })
);


// Utilisation des routes en tant que middleware
app.use('/auth', authRoutes);
app.use(userRoutes);
app.use(historiqueRoutes);
app.use(seed);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message || 'Erreur interne du serveur';
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log('Node.js est à l\'écoute sur le port %s ', PORT);
    });
  })
  .catch(err => console.log(err));

module.exports = app;