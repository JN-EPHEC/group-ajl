import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js"; 

// Import de la connexion base de données
import sequelize from './config/database.js';

// Import des Modèles (nécessaires pour les relations)
import Film from './models/Films.js';
import User from './models/Users.js';
import User_note from './models/Users_notes.js';
import Users_watchlist from './models/Users_watchlists.js';
import Realisateur from './models/Realisateurs.js';
import Genre from './models/Genres.js';
import Acteur from './models/Acteurs.js';
import Acteurs_films from './models/Acteurs_films.js';
import Genres_films from './models/Genres_films.js';

// Import des Fichiers de Routes
import filmsRoutes from './routes/FilmsRoutes.js';
import UsersRoutes from './routes/UsersRoutes.js';
import user_noteRoutes from './routes/user_noteRoutes.js';
import realsRoutes from './routes/RealsRoutes.js';
import acteursRoutes from './routes/ActeursRoutes.js';
import acteurs_filmsRoutes from './routes/Acteurs_filmsRoutes.js';
import genresRoutes from './routes/GenresRoutes.js';
import genres_filmsRoutes from './routes/Genres_FilmsRoutes.js';

// --- CORRECTION DES IMPORTS ---
import { requestLogger } from './middlewares/logger.js'; 
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// --- MIDDLEWARES GLOBAUX ---
app.use(cors()); 
app.use(express.json());
app.use(express.static('public'));
app.use(requestLogger); 

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- DÉFINITION DES RELATIONS SEQUELIZE ---
User_note.belongsTo(Film, { foreignKey: 'id_film' });
Film.hasMany(User_note, { foreignKey: 'id_film' });
User_note.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(User_note, { foreignKey: 'id_user' });
Users_watchlist.belongsTo(Film, { foreignKey: 'id_film' });
Film.hasMany(Users_watchlist, { foreignKey: 'id_film' });
Users_watchlist.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(Users_watchlist, { foreignKey: 'id_user' });
Film.belongsTo(Realisateur, { foreignKey: 'id_real' });
Realisateur.hasMany(Film, { foreignKey: 'id_real' });

Film.belongsToMany(Genre, { 
    through: Genres_films, 
    foreignKey: 'id_film', 
    otherKey: 'id_genre' 
});
Genre.belongsToMany(Film, { 
    through: Genres_films, 
    foreignKey: 'id_genre', 
    otherKey: 'id_film' 
});

Film.belongsToMany(Acteur, { 
    through: Acteurs_films, 
    foreignKey: 'id_film', 
    otherKey: 'id_acteurs' 
});
Acteur.belongsToMany(Film, { 
    through: Acteurs_films, 
    foreignKey: 'id_acteurs', 
    otherKey: 'id_film' 
});

// --- ENREGISTREMENT DES ROUTES ---
app.use('/api/films', filmsRoutes);
app.use('/api/users', UsersRoutes);
app.use('/api/users-notes', user_noteRoutes);
app.use('/api/reals', realsRoutes);
app.use('/api/acteurs', acteursRoutes);
app.use('/api/acteurs-films', acteurs_filmsRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/genres-films', genres_filmsRoutes);

// --- GESTION D'ERREURS ---
app.use(errorHandler);

// --- SYNCHRONISATION ET DÉMARRAGE ---
sequelize.sync().then(() => {
    console.log(" Base de données synchronisée");
    app.listen(port, () => {
        console.log(` Serveur opérationnel : http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Erreur de synchronisation :", err);
});