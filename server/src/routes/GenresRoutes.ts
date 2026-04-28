import { Router } from 'express';
import * as GenreControllers from "../controllers/GenresControllers";
import { checkIdParam } from '../middlewares/checkIdParam.js';

const router = Router();

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Récupère la liste des genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: Liste des genres récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/", GenreControllers.getAllGenres);

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Ajoute un genre
 *     tags: [Genres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Horror
 *     responses:
 *       201:
 *         description: Genre créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", GenreControllers.createGenre);

/**
 * @swagger
 * /api/genres/{genre_id}:
 *   delete:
 *     summary: Supprime un genre
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: genre_id
 *         required: true
 *         description: Identifiant du genre
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Genre supprimé avec succès
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Genre introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:genre_id", checkIdParam, GenreControllers.deleteGenres);

export default router;