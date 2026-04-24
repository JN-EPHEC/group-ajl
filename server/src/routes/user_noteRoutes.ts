import { Router } from "express";
import * as user_noteControllers from "../controllers/user_noteControllers.js";
import { checkIdParam } from '../middlewares/checkIdParam.js';

const router = Router();

/**
 * @swagger
 * /api/user-note:
 *   get:
 *     summary: Récupère toutes les notes utilisateur sur les films
 *     tags: [User_note]
 *     responses:
 *       200:
 *         description: Succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/", user_noteControllers.getAllUser_note);

/**
 * @swagger
 * /api/user-note:
 *   post:
 *     summary: Ajoute une note d'un utilisateur sur un film
 *     tags: [User_note]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               film_id:
 *                 type: integer
 *               note:
 *                 type: integer
 *               commentaire:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note créée
 *       500:
 *         description: Erreur serveur
 */
router.post("/", user_noteControllers.createUser_note);

/**
 * @swagger
 * /api/user-note/{user_id}/{film_id}:
 *   delete:
 *     summary: Supprime la note d'un utilisateur sur un film
 *     tags: [User_note]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
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
 *         description: Note introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:user_id/:film_id", checkIdParam, user_noteControllers.deleteUser_note);

export default router;