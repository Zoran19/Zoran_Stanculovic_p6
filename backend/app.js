const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const sauceRoutes = require("./routes/sauce");
const userRoutes = require('./routes/user');
const path = require('path');



//Connecté à mongodb
mongoose.connect(`${process.env.DB_URl}`,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//Empecher les erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//bodyParser convertis les données recu en json
app.use(bodyParser.json());

// indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base)
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/sauces",sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;