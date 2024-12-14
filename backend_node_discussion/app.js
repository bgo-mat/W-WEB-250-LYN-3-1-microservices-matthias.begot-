require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const discussionRoutes = require('./routes/discussionRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => {
        console.error('Erreur de connexion à MongoDB:', err);
        process.exit(1);
    });

app.use('/api/discussions', discussionRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Quelque chose s\'est mal passé!' });
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log(`Serveur Express en écoute sur le port ${PORT}`);
});
