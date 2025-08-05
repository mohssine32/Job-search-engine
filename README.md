# JobYoum

**JobYoum** est une plateforme web complète de recherche d’emploi, inspirée de sites comme Indeed et HelloWork.  
Elle permet aux **candidats** de rechercher et postuler à des offres, et aux **recruteurs** de publier et gérer leurs annonces via un tableau de bord.  
Le projet est construit avec un **frontend React** moderne et un **backend NestJS** sécurisé basé sur Node.js.

---



## ✨ Fonctionnalités principales

- 🔍 **Recherche d’emplois avec filtres** :
  - Ville
  - Type de contrat (CDI, CDD, Stage, Alternance)
  - Salaire minimum

- 📄 **Affichage détaillé** des offres d’emploi

- 👤 **Espace candidat** :
  - Authentification JWT
  - Postuler aux offres

- 🧑‍💼 **Espace recruteur** :
  - Ajouter, modifier et supprimer des offres
  - Tableau de bord personnalisé

- 🔐 **Rôles et permissions** :
  - Candidat
  - Recruteur
  - Admin *(si prévu)*

---

## 🛠️ Technologies utilisées

### Frontend

- React  
- TypeScript  
- Tailwind CSS  
- Vite

### Backend

- Node.js  
- NestJS  
- Prisma (ORM)  
- PostgreSQL  
- JWT (authentification)  
- Dotenv
Installation
1. Cloner le projet
bash
Copier
Modifier
git clone https://github.com/ton-utilisateur/jobyoum.git
cd jobyoum
2. Installation du backend
bash
Copier
Modifier
cd backend
npm install
🔧 Configuration
Créer un fichier .env dans le dossier backend :

env
Copier
Modifier
DATABASE_URL=postgresql://utilisateur:motdepasse@localhost:5432/jobyoum
JWT_SECRET=ton_jwt_secret
Initialiser la base de données avec Prisma :

bash
Copier
Modifier
npx prisma migrate dev
npx prisma generate
Lancer le serveur :

bash
Copier
Modifier
npm run start:dev
3. Installation du frontend
Ouvre un nouveau terminal :

bash
Copier
Modifier
cd frontend
npm install
npm run dev