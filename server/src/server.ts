import express from 'express';
import type { Request, Response } from 'express';
import filmsAdminRoutes from './routes/FilmAdminRoutes.js';
import sequelize from './config/database.js';
import UsersRoutes from './routes/UsersRoutes.js';
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
app.use('/api/films', filmsAdminRoutes);
app.use('/api/users', UsersRoutes);
//app.use(requestLogger);
//app.use(errorHandler);


const filmTest = {
  titre: "Inception",
  dateDeSortie: "2010-07-16",
  realisateur: "Christopher Nolan",
  duree: 148,
  genres: "Science-fiction, Action, Thriller",
  acteurs: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
  moyenne: 8.8
};

sequelize.sync().then(() => {
    console.log("Base de données synchronisée");
    app.listen(port, () =>{
        console.log(`Serveur ok http://localhost:${port}`);
    });
});