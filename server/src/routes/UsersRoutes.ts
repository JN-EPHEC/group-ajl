import { Router } from "express";
import * as UserControllers from "../controllers/UserControllers.js";
import { checkIdParam } from "../middlewares/checkIdParam.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs et de leur authentification
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Inscription d’un nouvel utilisateur
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Données invalides
 */
router.post("/", UserControllers.createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
router.post("/login", UserControllers.loginUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Succès
 */
router.get("/", UserControllers.getAllUsers);

/**
 * @swagger
 * /api/users/{user_id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID
 *     tags: [Users]
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
router.get("/:user_id", checkIdParam, UserControllers.getUserById);

/**
 * @swagger
 * /api/users/{user_id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete("/:user_id", checkIdParam, UserControllers.deleteUser);

/**
 * @swagger
 * tags:
 *   name: Users_watchlist
 *   description: Gestion de la liste de films à voir
 */

/**
 * @swagger
 * /api/users/{user_id}/watchlist:
 *   get:
 *     summary: Récupère la watchlist d’un utilisateur
 *     tags: [Users_watchlist]
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
router.get("/:user_id/watchlist", checkIdParam, UserControllers.getUsers_watchlist);

/**
 * @swagger
 * /api/users/{user_id}/watchlist:
 *   post:
 *     summary: Ajoute un film à la watchlist d’un utilisateur
 *     tags: [Users_watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Film ajouté à la watchlist
 *       401:
 *         description: Non autorisé
 */
router.post("/:user_id/watchlist", verifyToken, UserControllers.addFilmToUsersWatchlist);

/**
 * @swagger
 * /api/users/{user_id}/watchlist/{film_id}:
 *   delete:
 *     summary: Supprime un film de la watchlist
 *     tags: [Users_watchlist]
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
 *         description: Film supprimé de la watchlist
 *       404:
 *         description: Film ou utilisateur non trouvé
 */
router.delete(
  "/:user_id/watchlist/:film_id",
  checkIdParam,
  UserControllers.supprimerFilmDeWatchlist
);

export default router;