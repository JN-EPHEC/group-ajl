import {Router, type Request, type Response} from 'express';
import * as UserControllers from "../controllers/UserControllers";
import { checkIdParam } from '../middlewares/checkIdParam.js';


const router = Router();

/**
* @swagger
* /api/users:
*   get:
*       summary: Récupère la liste des films
*       tags: [Users]
*       responses:
*           200:
*               description: Succès
*           500:
*               description: Erreur serveur
*/
router.get("/", UserControllers.getAllUsers);

/**
* @swagger
* /api/users/{user_id}/watchlist:
*   get:
*       summary: Récupère la watchlist d'un utilisateur
*       tags: [USers_watchlist]
*       responses:
*           200:
*               description: Succès
*           500:
*               description: Erreur serveur
*/
router.get("/:user_id/watchlist", UserControllers.getUsers_watchlist);

/**
* @swagger
* /api/users/{user_id}/watchlist:
*   get:
*       summary: Ajoute un film à la watchlist d'un utilisateur
*       tags: [Users_watchlist]
*       responses:
*           200:
*               description: Succès
*           500:
*               description: Erreur serveur
*/
router.post("/:user_id/watchlist", UserControllers.addFilmToUsersWatchlist);

/**
* @swagger
* /api/users:
*   post:
*       summary: Ajoute un utilisateur à la liste des utilisateurs
*       tags: [Users]
*       responses:
*           201:
*               description: Succès
*           500:
*               description: Erreur serveur
*/
router.post('/', UserControllers.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: object
 *         required: true
 *         description: Identifiant numérique de l'utilisateur
 *     responses:
 *       204:
 *         description: Succès
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', checkIdParam, UserControllers.deleteUser);

/**
 * @swagger
 * /api/users/{users_id}/watchlist/{film_id}:
 *   delete:
 *     summary: Supprime un film de la watchlist
 *     tags: [Users_watchlist]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: object
 *         required: true
 *         description: Identifiant numérique de l'utilisateur
 *     responses:
 *       204:
 *         description: Succès
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:user_id/watchlist/:film_id', checkIdParam, UserControllers.supprimerFilmDeWatchlist);

export default router;