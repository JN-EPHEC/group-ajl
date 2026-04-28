import { Router } from 'express';
import * as ActeursControllers from "../controllers/ActeursControllers";
import { checkIdParam } from '../middlewares/checkIdParam.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Acteurs
 *   description: Gestion des Acteurs
 */

/**
 * @swagger
 * /api/acteurs:
 *   get:
 *     summary: Récupère la liste des acteurs
 *     tags: [Acteurs]
 *     responses:
 *       200:
 *         description: Liste des acteurs récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/", ActeursControllers.getAllActeurs);

/**
 * @swagger
 * /api/acteurs:
 *   post:
 *     summary: Ajoute un acteurs
 *     tags: [Acteurs]
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
 *                 example: Cruise
 *               prenom:
 *                 type: string
 *                 example: Tom
 *     responses:
 *       201:
 *         description: Acteur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", ActeursControllers.createActeurs);

/**
 * @swagger
 * /api/acteurs/{acteur_id}:
 *   delete:
 *     summary: Supprime un acteur
 *     tags: [Acteurs]
 *     parameters:
 *       - in: path
 *         name: acteur_id
 *         required: true
 *         description: Identifiant de l'acteur
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Acteur supprimé avec succès
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Acteur introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:acteur_id", checkIdParam, ActeursControllers.deleteActeurs);

export default router;