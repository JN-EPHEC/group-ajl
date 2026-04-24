import { Router } from 'express';
import * as RealsControllers from "../controllers/RealisateursControllers";
import { checkIdParam } from '../middlewares/checkIdParam.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Réalisateurs
 *   description: Gestion des réalisateurs
 */

/**
 * @swagger
 * /api/reals:
 *   get:
 *     summary: Récupère la liste des réalisateurs
 *     tags: [Réalisateurs]
 *     responses:
 *       200:
 *         description: Liste des réalisateurs récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/", RealsControllers.getAllReals);

/**
 * @swagger
 * /api/reals:
 *   post:
 *     summary: Ajoute un réalisateur
 *     tags: [Réalisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Nolan
 *               prenom:
 *                 type: string
 *                 example: Christopher
 *     responses:
 *       201:
 *         description: Réalisateur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", RealsControllers.createReal);

/**
 * @swagger
 * /api/reals/{realisateur_id}:
 *   delete:
 *     summary: Supprime un réalisateur
 *     tags: [Réalisateurs]
 *     parameters:
 *       - in: path
 *         name: realisateur_id
 *         required: true
 *         description: Identifiant du réalisateur
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Réalisateur supprimé avec succès
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Réalisateur introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:realisateur_id", checkIdParam, RealsControllers.deleteReal);

export default router;