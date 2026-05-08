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

const app = express();
const port = 3000;

app.use(cors()); // Autorise tout le monde (acceptable uniquement en dev)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static('public'));
app.use(express.json());

User_note.belongsTo(Film, { foreignKey: 'film_id' });
Film.hasMany(User_note, { foreignKey: 'film_id' });

User_note.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(User_note, { foreignKey: 'user_id' });

Users_watchlist.belongsTo(Film, { foreignKey: 'film_id' });
Film.hasMany(Users_watchlist, { foreignKey: 'film_id' });

Users_watchlist.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Users_watchlist, { foreignKey: 'user_id' });

Film.belongsTo(Realisateur, { foreignKey: 'realisateur_id' });
Film.hasMany(User_note, { foreignKey: 'film_id' });

Film.belongsToMany(Genre, { through: 'Genres_Films', foreignKey: 'film_id' });
Genre.belongsToMany(Film, { through: 'Genres_Films', foreignKey: 'genre_id' });

Film.belongsToMany(Acteur, { 
    through: 'Acteurs_films', 
    foreignKey: 'film_id', 
    otherKey: 'acteur_id' 
});
Acteur.belongsToMany(Film, { 
    through: 'Acteurs_films', 
    foreignKey: 'acteur_id', 
    otherKey: 'film_id' 
});

app.use('/api/films', filmsRoutes);
app.use('/api/users', UsersRoutes);
app.use('/api/user-note', user_noteRoutes);
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