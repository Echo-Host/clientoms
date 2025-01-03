# ClientOMS

**ClientOMS** est une application Node.js pour la gestion des clients. Ce projet est toujours en développement.

---

## Table des Matières
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [API](#api)
- [Configuration](#configuration)
- [Contribuer](#contribuer)
- [Licence](#licence)

---

## Fonctionnalités
- Gestion des utilisateurs et des services associés.
- Connexion et inscription des utilisateurs via une interface simple.
- API REST pour récupérer des informations sur les utilisateurs, les services, les statistiques, etc.
- Prise en charge de l'authentification par session.

---

## Prérequis
- Node.js (version 14.x ou plus récente recommandée)
- npm (version 6.x ou plus) ou Yarn (optionnel)
- Fichiers de données `user.yml`, `invoices.yml`, et `tickets.yml` doivent exister dans le répertoire `data`.

---

## Installation

1. **Cloner le Dépôt**
   ```bash
   git clone https://github.com/votre-repo/clientoms.git
   cd clientoms
   ```

2. **Installer les Dépendances**
   ```bash
   npm install
   ```

3. **Configurer le fichier `config.json`**
   Créez un fichier `config.json` à la racine du projet avec la configuration suivante :
   ```json
   {
    "name": "ClientOMS",
    "offers": [
        {
            "name": "Offer 1",
            "description": "Description for Offer 1",
            "price": "€5.00"
        },
        {
            "name": "Offer 2",
            "description": "Description for Offer 2",
            "price": "€8.00"
        }
    ]
   }
   ```

4. **Démarrer l'Application**
   ```bash
   npm start
   ```

---

## Utilisation
L'application sera accessible à l'adresse suivante : `http://localhost:<PORT>` (le port par défaut est 3000).

### Pages principales
- **Page de connexion** : `/`
- **Page d'inscription** : `/register`
- **Page des offres** : `/offers`
- **Tableau de bord** (accès après connexion) : `/dashboard`

---

## API
L'application expose plusieurs points d'API pour interagir avec les utilisateurs et récupérer des statistiques.

### Routes API

#### Récupérer les statistiques globales
- **GET** `/api/stats`
  - Retourne des statistiques sur le nombre d'utilisateurs, de services, de factures payées et de tickets en attente.

#### Récupérer les services d'un utilisateur spécifique
- **GET** `/api/services/:username`
  - Retourne la liste des services d'un utilisateur donné.

---

## Configuration

L'application nécessite un fichier de configuration `config.json` pour définir les paramètres essentiels comme le port, le nom de l'application, et les offres disponibles.

Il est également important de noter que les utilisateurs sont stockés dans un fichier `user.yml`. Ce fichier contient des informations sensibles et **ne doit pas être partagé ou exposé**. Assurez-vous que ce fichier est sécurisé.

---

## Contribuer
Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le dépôt.
2. Créez une nouvelle branche : `git checkout -b feature/votre-fonctionnalité`.
3. Faites vos modifications et committez-les : `git commit -m 'Ajout de votre fonctionnalité'`.
4. Poussez votre branche : `git push origin feature/votre-fonctionnalité`.
5. Ouvrez une pull request.

---

## Licence
Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus de détails.
