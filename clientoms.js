const express = require('express');
const path = require('path');
const fs = require('fs');
const YAML = require('yaml');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const config = require('./config/config.json');
const nameText = config.name;  // Utilisation de 'name' ici
const session = require('express-session');


let usersFile = fs.readFileSync('./data/user.yml', 'utf8');
let usersData = YAML.parse(usersFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(session({
    secret: 'secret-key', // Change ça par une clé secrète
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Si tu utilises HTTPS, mets `secure: true`
}));



app.get('/', (req, res) => {
    res.render('login', { title: 'Connexion à l\'Espace Client', name: nameText });
});


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
    const user = usersData.find(u => u.username === 'testuser'); 
    res.render('dashboard', { title: 'Tableau de Bord', user: user, name: nameText });
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



// Route pour récupérer les statistiques globales
app.get('/api/stats', (req, res) => {
    // Calcul du nombre total de services à partir des données des utilisateurs
    const totalServices = usersData.reduce((count, user) => count + (user.services ? user.services.length : 0), 0);

    // Récupérer les factures depuis un fichier ou une source existante
    let invoicesData;
    try {
        invoicesData = YAML.parse(fs.readFileSync('./data/invoices.yml', 'utf8'));
    } catch (error) {
        invoicesData = [];
    }

    const invoicesPaid = invoicesData.filter(invoice => invoice.status === 'paid').length;

    // Récupérer les tickets depuis un fichier ou une source existante
    let ticketsData;
    try {
        ticketsData = YAML.parse(fs.readFileSync('./data/tickets.yml', 'utf8'));
    } catch (error) {
        ticketsData = [];
    }

    const pendingTickets = ticketsData.filter(ticket => ticket.status === 'pending').length;

    // Construction des statistiques
    const stats = {
        totalUsers: usersData.length,
        totalServices,
        invoicesPaid,
        pendingTickets,
    };

    res.json(stats);
});

// Route pour récupérer les services d'un utilisateur spécifique
app.get('/api/services/:username', (req, res) => {
    const { username } = req.params;
    const user = usersData.find(user => user.username === username);

    if (user && user.services) {
        res.json(user.services);
    } else {
        res.status(404).json({ message: 'Utilisateur ou services introuvables.' });
    }
});


// Lancer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
