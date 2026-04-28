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

const app = express();
const port = 3000;

app.use(cors()); // Autorise tout le monde (acceptable uniquement en dev)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static('public'));
app.use(express.json());
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