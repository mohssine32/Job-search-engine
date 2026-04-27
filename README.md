# JobYoum

JobYoum est une plateforme web de recrutement qui connecte des candidats et des recruteurs dans une interface moderne, rapide et orientee produit.

Le projet permet aux candidats de consulter des offres, filtrer les resultats, afficher le detail d'un poste et postuler en ligne. Cote recruteur, l'application propose un espace dedie pour publier, modifier et gerer les offres d'emploi.

## Apercu

JobYoum est construit en architecture full-stack avec :

- un frontend React avec Vite et TypeScript
- un backend NestJS structure autour d'une API REST
- une base de donnees PostgreSQL geree avec Prisma

L'objectif est de proposer une base claire, maintenable et evolutive pour une plateforme de recrutement moderne.

## Fonctionnalites

- Authentification utilisateur avec JWT
- Gestion des roles candidat et recruteur
- Consultation des offres d'emploi
- Recherche et filtrage des offres
- Affichage detaille d'une offre
- Depot de candidature
- Creation, modification et suppression d'offres cote recruteur
- Tableau de bord recruteur
- API backend structuree avec NestJS

## Stack Technique

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- NestJS
- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Swagger

### Outils

- Docker
- ESLint
- Prettier
- Jest

## Structure Du Projet

```text
Job Finder/
|- Frontend/   # application client React
|- backend/    # API NestJS
|- docker-compose.yml
`- README.md
```

## Installation

### 1. Cloner Le Projet

```bash
git clone https://github.com/mohssine32/Job-search-engine.git
cd Job-search-engine
```

### 2. Installer Le Backend

```bash
cd backend
npm install
```

### 3. Installer Le Frontend

```bash
cd ../Frontend
npm install
```

## Configuration

### Frontend

Creer un fichier `.env` dans `Frontend` :

```env
VITE_API_URL=http://localhost:3000
```

### Backend

Creer un fichier `.env` dans `backend` :

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/jobyoum
JWT_SECRET=your_jwt_secret
```

## Demarrage Du Projet

### Lancer Le Backend

Depuis `backend` :

```bash
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

### Lancer Le Frontend

Depuis `Frontend` :

```bash
npm run dev
```

## Scripts Utiles

### Backend

```bash
npm run start
npm run start:dev
npm run build
npm run lint
npm run test
npm run test:e2e
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Profils Utilisateurs

### Candidat

- Rechercher des offres d'emploi
- Filtrer les resultats selon plusieurs criteres
- Consulter les details d'une annonce
- Envoyer une candidature

### Recruteur

- Publier une offre
- Modifier ou supprimer une annonce
- Gerer les offres publiees
- Consulter les candidatures recues

## Evolutions Possibles

- Recherche avancee multi-criteres
- Sauvegarde des offres favorites
- Notifications utilisateur
- Gestion enrichie des profils candidats
- Dashboard administrateur
- Deploiement cloud complet

## Auteur

Developpe par Mohssine.

## Licence

Projet personnel et academique.