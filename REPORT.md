# REPORT — Projet Développement Informatique III

**Groupe 2TL1-7 :** Justin Aerts · Arnaud Peeters · Lucas Schenkel

---

## 1. Pitch de l'application

C'est un site de classement et de notation de films par les utilisateurs.

L'utilisateur peut parcourir un catalogue de films enrichi de données (réalisateur, acteurs, genres, durée, affiche), consulter la note moyenne calculée à partir des avis de la communauté, et gérer son profil personnel. Une fois inscrit et connecté, il peut :

- **noter** un film de 1 à 5 étoiles et laisser un commentaire,
- **gérer sa watchlist** en ajoutant ou retirant des films qu'il souhaite voir,
- **retrouver ses films notés** depuis son espace profil.

L'application est composée d'un front-end React (TypeScript + Vite) qui communique avec une API REST Node.js / Express (TypeScript) s'appuyant sur une base de données PostgreSQL via Sequelize.

---

## 2. Refactoring initial

### Code choisi

Le code retenu pour le refactoring initial est celui de **Lucas Schenkel**. Il constituait la base la plus avancée structurellement : serveur Express fonctionnel, modèles Sequelize définis, routes et contrôleurs séparés, et un début de gestion de l'authentification JWT.

### Difficultés d'adaptation pour les autres membres

**Justin Aerts** a rencontré des difficultés principalement sur deux points :

1. **L'organisation en modules ESM** (`"type": "module"` dans `package.json`) combinée à TypeScript obligeait à écrire les imports avec l'extension `.js` dans le code source (ex. `import Film from './models/Films.js'`), ce qui est contre-intuitif quand on travaille avec des fichiers `.ts`.
2. **Le pattern Singleton** appliqué à la connexion Sequelize (classe `Database` avec `getInstance()`) n'était pas immédiatement lisible pour quelqu'un habitué à exporter directement l'instance.

**Arnaud Peeters** a principalement été ralenti par :

1. **La gestion asynchrone** systématique (`async/await` dans tous les contrôleurs) et la structure `try/catch` associée, qui diffère d'une approche avec callbacks ou middleware d'erreur centralisé.
2. **La séparation stricte modèles / contrôleurs / routes** : il fallait bien identifier dans quel fichier ajouter du code, notamment pour les associations Sequelize (définies dans `server.ts` après les imports de modèles plutôt que dans les modèles eux-mêmes).

---

## 3. Infrastructure de déploiement

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                        │
│                                                                 │
│  Push / PR  ──►  GitHub Actions CI (ci.yml)                     │
│                      └─ npm install (server/)                   │
│                      └─ npm test  ──► Jest (tests unitaires)    │
│                                                                 │
│  Push main  ──►  GitHub Actions CD (cd-frontend.yml)            │
│                      └─ npm install + npm run build (client/)   │
│                      └─ SCP ──► /var/www/html/ sur le VPS       │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VPS  (91.134.137.41)                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Nginx (port 80 / 443)                                   │   │
│  │                                                          │   │
│  │   /          ──►  /var/www/html/   (front React buildé)  │   │
│  │   /api/...   ──►  proxy_pass → localhost:3000            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                │                                │
│                                ▼                                │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  Docker Container — Backend Node.js                 │        │
│  │  (image buildée depuis server/Dockerfile)           │        │
│  │                                                     │        │
│  │  node:18-alpine                                     │        │
│  │  WORKDIR /usr/src/app                               │        │
│  │  npm run build  (tsc → dist/)                       │        │
│  │  npm start  → Express sur le port 3000              │        │
│  └─────────────────────────────────────────────────────┘        │
│                                │                                │
│                                ▼                                │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  Base de données PostgreSQL                         │        │
│  │  (hébergée sur le VPS ou service externe)           │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

**Flux résumé :**

1. Un push sur n'importe quelle branche déclenche le pipeline CI : installation des dépendances et exécution de la suite de tests Jest. Si un test échoue, le merge est bloqué.
2. Un push sur `main` déclenche en plus le pipeline CD : le front-end React est compilé (`vite build`) puis déployé par SCP directement dans le répertoire servi par Nginx sur le VPS.
3. Le back-end est conteneurisé avec Docker (image `node:18-alpine`). L'image compile le TypeScript au build, puis démarre le serveur Express sur le port `3000`.
4. Nginx joue le rôle de reverse proxy : il sert les fichiers statiques du front-end et redirige les requêtes `/api/` vers le conteneur Docker.

---

## 4. Design Patterns utilisés

### Singleton — `src/config/database.ts`

La connexion à la base de données PostgreSQL est encapsulée dans une classe `Database` avec un constructeur privé et une méthode statique `getInstance()`. Cela garantit qu'une seule instance de `Sequelize` est créée pour toute la durée de vie du serveur, évitant les connexions multiples et les fuites de ressources.

```typescript
class Database {
  private static instance: Sequelize;
  private constructor() {}

  public static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Sequelize({ /* config */ });
    }
    return Database.instance;
  }
}
export default Database.getInstance();
```

**Pourquoi ici ?** Une connexion de base de données est coûteuse à établir et doit être partagée entre tous les modules qui en ont besoin (contrôleurs, modèles). Le Singleton évite de recréer la connexion à chaque import.

---

### MVC (Model – View – Controller)

L'architecture du serveur suit le pattern MVC adapté à une API REST :

| Couche | Dossier | Rôle |
|---|---|---|
| **Model** | `src/models/` | Définition des entités Sequelize (Film, User, Genre…) |
| **Controller** | `src/controllers/` | Logique métier, lecture/écriture BDD, formatage des réponses |
| **View** | — | Remplacée par les réponses JSON (API REST sans rendu HTML) |
| **Router** | `src/routes/` | Mapping URL → contrôleur + application des middlewares |

**Pourquoi ici ?** Séparer les responsabilités rend le code testable indépendamment (on peut mocker les modèles pour tester les contrôleurs sans BDD réelle) et facilite la répartition du travail dans l'équipe.

---

### Middleware Chain (chaîne de responsabilité)

Express utilise nativement le pattern **Chain of Responsibility** via ses middlewares. Le projet en tire parti pour :

- **`authMiddleware.ts`** : vérifie le JWT avant d'accéder aux routes protégées.
- **`checkIdParam.ts`** : valide que les paramètres d'URL numériques sont bien des nombres.
- **`errorHandler.ts`** : centralise la gestion des erreurs en fin de chaîne.
- **`logger.ts`** : loggue chaque requête entrante hors production.

**Pourquoi ici ?** Chaque middleware a une responsabilité unique et peut être ajouté ou retiré d'une route sans modifier la logique métier du contrôleur.

---

## 5. Rapport de couverture de test (Coverage)

Les tests unitaires couvrent les utilitaires (`utils/`), les middlewares et les contrôleurs principaux. La suite complète est lancée avec :

```bash
cd server && npm run test:coverage
```

Résultats obtenus :

```
---------------------|---------|----------|---------|---------|
File                 | % Stmts | % Branch | % Funcs | % Lines |
---------------------|---------|----------|---------|---------|
All files            |   98.57 |    96.87 |     100 |   98.32 |
 controllers         |   99.22 |    95.45 |     100 |   99.09 |
  UserControllers.ts |   98.83 |    94.44 |     100 |   98.66 |
  filmControllers.ts |     100 |      100 |     100 |     100 |
 middlewares         |     100 |      100 |     100 |     100 |
  authMiddleware.ts  |     100 |      100 |     100 |     100 |
  checkIdParam.ts    |     100 |      100 |     100 |     100 |
  errorHandler.ts    |     100 |      100 |     100 |     100 |
  logger.ts          |     100 |      100 |     100 |     100 |
 utils               |   96.22 |    96.55 |     100 |   95.55 |
  password.ts        |     100 |      100 |     100 |     100 |
  shipping.ts        |    87.5 |    85.71 |     100 |    87.5  |
  userValidator.ts   |     100 |      100 |     100 |     100 |
---------------------|---------|----------|---------|---------|
```

> **76 tests · 7 suites · 0 échec**
> Couverture globale : **~98%** (seuil requis : 80%)

_(Remplacer ce tableau par une capture d'écran du terminal lors du rendu final.)_