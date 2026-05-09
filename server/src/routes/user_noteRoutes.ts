import { Router } from "express";
import * as user_noteControllers from "../controllers/user_noteControllers.js";
import { checkIdParam } from "../middlewares/checkIdParam.js";

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
 */
router.get("/", user_noteControllers.getAllUser_note);

/**
 * @swagger
 * /api/user-note:
 *   post:
 *     summary: Ajoute une note d'un utilisateur sur un film
 *     tags: [User_note]
 *     responses:
 *       201:
 *         description: Note créée
 */
router.post("/", user_noteControllers.createUser_note);

/**
 * @swagger
 * /api/user-note/film/{film_id}:
 *   get:
 *     summary: Récupère tous les avis pour un film spécifique
 *     tags: [User_note]
 *     parameters:
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès
 */
router.get("/film/:film_id", user_noteControllers.getNotesForFilm);

/**
 * @swagger
 * /api/user-note/user/{user_id}:
 *   get:
 *     summary: Récupère toutes les notes d’un utilisateur spécifique
 *     tags: [User_note]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/user/:user_id", user_noteControllers.getNotesByUserId);

/**
 * @swagger
 * /api/user-note/{user_id}/{film_id}:
 *   delete:
 *     summary: Supprime la note d’un utilisateur pour un film
 *     tags: [User_note]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note supprimée
 *       404:
 *         description: Note non trouvée
 */
router.delete("/:user_id/:film_id", checkIdParam, user_noteControllers.deleteUser_note);

/**
 * @swagger
 * /api/user-note/{user_id}/{film_id}:
 *   get:
 *     summary: Récupère la note d’un utilisateur pour un film
 *     tags: [User_note]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès
 *       404:
 *         description: Note non trouvée
 */
router.get("/:user_id/:film_id", checkIdParam, user_noteControllers.getUserNoteForFilm);

/**
 * @swagger
 * /api/user-note/{user_id}/{film_id}:
 *   put:
 *     summary: Met à jour la note d’un utilisateur pour un film
 *     tags: [User_note]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note mise à jour
 *       404:
 *         description: Note non trouvée
 */
router.put("/:user_id/:film_id", checkIdParam, user_noteControllers.updateUser_note);

export default router;