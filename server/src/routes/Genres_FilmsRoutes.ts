import { Router } from "express";
import * as Genres_filmsControllers from "../controllers/Genres_filmsControllers";
import { checkIdParam } from '../middlewares/checkIdParam.js';

const router = Router();

/**
 * @swagger
 * /api/genres-films:
 *   get:
 *     summary: Récupère tous les genres - films 
 *     tags: [Genres_Films]
 *     responses:
 *       200:
 *         description: Succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/", Genres_filmsControllers.getAllGenres_films);

/**
 * @swagger
 * /api/genres-films:
 *   post:
 *     summary: Ajoute un genre à un film
 *     tags: [Genres_Films]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genre_id:
 *                 type: integer
 *               film_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Genre ajouté au film
 *       500:
 *         description: Erreur serveur
 */
router.post("/", Genres_filmsControllers.createGenres_films);

/**
 * @swagger
 * /api/genres-films/{genre_id}/{film_id}:
 *   delete:
 *     summary: Supprime un genre - film
 *     tags: [Genres_Films]
 *     parameters:
 *       - in: path
 *         name: genre_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du genre
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du film
 *     responses:
 *       204:
 *         description: Succès
 *       404:
 *         description: Genre_Film introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:genre_id/:film_id", checkIdParam, Genres_filmsControllers.deleteGenres_films);

export default router;