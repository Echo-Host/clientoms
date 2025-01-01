const express = require('express');
const path = require('path');
const fs = require('fs');
const YAML = require('yaml');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const config = require('./config/config.json');
const nameText = config.name;  // Utilisation de 'name' ici

let usersFile = fs.readFileSync('./data/user.yml', 'utf8');
let usersData = YAML.parse(usersFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Dossier pour les fichiers statiques (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Page d'accueil (page de connexion)
app.get('/', (req, res) => {
    res.render('login', { title: 'Connexion à l\'Espace Client', name: nameText });
});

// Page d'offres
app.get('/offers', (req, res) => {
    res.render('offers', { title: 'Nos Offres', offers: config.offers, name: nameText });  // Utilisation de 'name' ici
});

// Page d'inscription
app.get('/register', (req, res) => {
    res.render('register', { title: 'Inscription à l\'Espace Client', name: nameText });  // Utilisation de 'name' ici
});

// Route pour la connexion des utilisateurs
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = usersData.find(user => user.username === username && user.password === password);
    if (user) {
        res.redirect('/dashboard');
    } else {
        res.status(401).send('Identifiants invalides');
    }
});

// Page du dashboard (après connexion)
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Tableau de Bord', user: 'Username', name: nameText });  // Utilisation de 'name' ici
});

// Route pour l'inscription des utilisateurs
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    if (usersData.some(user => user.username === username || user.email === email)) {
        return res.status(400).send('Nom d\'utilisateur ou email déjà utilisé');
    }

    // Ajouter le nouvel utilisateur
    const newUser = { username, email, password };
    usersData.push(newUser);

    // Sauvegarder les données dans user.yml
    usersFile = YAML.stringify(usersData);
    fs.writeFileSync('./data/user.yml', usersFile, 'utf8');

    // Rediriger vers la page de connexion après inscription réussie
    res.redirect('/');
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
