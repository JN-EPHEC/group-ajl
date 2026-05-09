import express from 'express';
import type { Request, Response } from 'express';
import filmsRoutes from './routes/FilmsRoutes.js';
import sequelize from './config/database.js';
import UsersRoutes from './routes/UsersRoutes.js';
import user_noteRoutes from './routes/user_noteRoutes.js';
import realsRoutes from './routes/RealsRoutes.js';
import acteursRoutes from './routes/ActeursRoutes.js';
import acteurs_filmsRoutes from './routes/Acteurs_filmsRoutes.js';
import genresRoutes from './routes/GenresRoutes.js';
import genres_filmsRoutes from './routes/Genres_FilmsRoutes.js';
//import { requestLogger } from './middlewares/logger.js';
//import { errorHandler } from './middlewares/errorHandler.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from 'cors';
import Film from './models/Films.js';
import User from './models/Users.js';
import User_note from './models/Users_notes.js';
import Users_watchlist from './models/Users_watchlists.js';
import Realisateur from './models/Realisateurs.js';
import Genre from './models/Genres.js';
import Acteur from './models/Acteurs.js';
import Acteurs_films from './models/Acteurs_films.js';
import Genres_films from './models/Genres_films.js';

const app = express();
const port = 3000;

app.use(cors()); // Autorise tout le monde (acceptable uniquement en dev)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static('public'));
app.use(express.json());


// 1. Relations Notes (users_notes)
User_note.belongsTo(Film, { foreignKey: 'id_film' });
Film.hasMany(User_note, { foreignKey: 'id_film' });

User_note.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(User_note, { foreignKey: 'id_user' });

// 2. Relations Watchlist (users_watchlists)
Users_watchlist.belongsTo(Film, { foreignKey: 'id_film' });
Film.hasMany(Users_watchlist, { foreignKey: 'id_film' });

Users_watchlist.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(Users_watchlist, { foreignKey: 'id_user' });

// 3. Relation Réalisateur (realisateurs)
Film.belongsTo(Realisateur, { foreignKey: 'id_real' }); // Modifié: id_real
Realisateur.hasMany(Film, { foreignKey: 'id_real' });   // Modifié: id_real

// 4. Relations Films <-> Genres (Table de liaison : genres_films)
Film.belongsToMany(Genre, { 
    through: Genres_films, 
    foreignKey: 'id_film', 
    otherKey: 'id_genre' // Modifié: id_genre (sans 's')
});
Genre.belongsToMany(Film, { 
    through: Genres_films, 
    foreignKey: 'id_genre', // Modifié: id_genre (sans 's')
    otherKey: 'id_film' 
});

// 5. Relations Films <-> Acteurs (Table de liaison : acteurs_films)
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

app.use('/api/films', filmsRoutes);
app.use('/api/users', UsersRoutes);
app.use('/api/users-notes', user_noteRoutes);
app.use('/api/reals', realsRoutes);
app.use('/api/acteurs', acteursRoutes);
app.use('/api/acteurs-films', acteurs_filmsRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/genres-films', genres_filmsRoutes);
//app.use(requestLogger);
//app.use(errorHandler);

sequelize.sync().then(() => {
    console.log("Base de données synchronisée");
    app.listen(port, () =>{
        console.log(`Serveur ok http://localhost:${port}`);
    });
});