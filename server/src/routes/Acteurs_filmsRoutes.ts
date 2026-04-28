import { Router } from "express";
import * as Acteurs_filmsControllers from "../controllers/Acteurs_filmsControllers";
import { checkIdParam } from '../middlewares/checkIdParam.js';

const router = Router();

/**
 * @swagger
 * /api/acteurs-films:
 *   get:
 *     summary: Récupère tous les acteurs d'un films
 *     tags: [Acteurs_films]
 *     responses:
 *       200:
 *         description: Succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/", Acteurs_filmsControllers.getAllActeurs_films);

/**
 * @swagger
 * /api/acteurs-films/{film_id}
 *   get:
 *     summary: Récupère tous les acteurs d'un films
 *     tags: [Acteurs_films]
 *     responses:
 *       200:
 *         description: Succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/:film_id", Acteurs_filmsControllers.getActeurs_film);

/**
 * @swagger
 * /api/acteurs-films:
 *   post:
 *     summary: Ajoute un acteur à un films
 *     tags: [Acteurs_films]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               acteur_id:
 *                 type: integer
 *               film_id:
 *                 type: integer
 *               note:
 *                 type: integer
 *               commentaire:
 *                 type: string
 *     responses:
 *       201:
 *         description: Acteur ajouté au film
 *       500:
 *         description: Erreur serveur
 */
router.post("/", Acteurs_filmsControllers.createActeurs_films);

/**
 * @swagger
 * /api/acteurs-films/{acteur_id}/{film_id}:
 *   delete:
 *     summary: Supprime un acteur d'un film
 *     tags: [Acteurs_films]
 *     parameters:
 *       - in: path
 *         name: acteur_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'acteur
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
 *         description: Acteur introuvable pour ce film
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:acteur_id/:film_id", checkIdParam, Acteurs_filmsControllers.deleteActeurs_films);

export default router;