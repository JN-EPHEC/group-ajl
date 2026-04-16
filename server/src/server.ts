import express from 'express';
import type { Request, Response } from 'express';
import filmsAdminRoutes from './routes/FilmAdminRoutes.js';
import sequelize from './config/database.js';
import User from './models/Films.js';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from 'cors';

const app = express();
const port = 3000;
const route = "/api/hello/:name"

app.use(cors()); // Autorise tout le monde (acceptable uniquement en dev)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static('public'));
app.use(express.json());
app.use('/api/films', filmsAdminRoutes);
app.use(requestLogger);
app.use(errorHandler);

const date_ajd = new Date();

app.get(`${route}`, (req: Request, res: Response) => {
    res.send(` {"message": "Bonjour ${req.params['name']}", "timestamp" : "${date_ajd.toLocaleDateString()}" }`);
});

sequelize.sync().then(() => {
    console.log("Base de données synchronisée");
    app.listen(port, () =>{
        console.log(`Serveur ok http://localhost:${port}`);
    });
});