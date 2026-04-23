import {Router, type Request, type Response} from 'express';
import * as user_noteControllers from "../controllers/user_noteControllers.js";
import { checkIdParam } from '../middlewares/checkIdParam.js';


const router = Router();

/**
* @swagger
* /api/user-note/{film_id}/{user_id}
*   get:
*       summary: Récupère la liste des films d'un utilisateur
*       tags: [Films]
*       responses:
*           200:
*               description: Succès
*           500:
*               description: Erreur serveur
*/
router.get("/", user_noteControllers.getAllUser_note);

/**
* @swagger
* /api/user-note/{film_id}/{user_id}:
*   post:
*       summary: Ajoute un film à la liste des films d'un utilisateur
*       tags: [Films]
*       responses:
*           201:
*               description: Succès
*           500:
*               description: Erreur serveur
*/
router.post('/', user_noteControllers.createUser_note);

/**
 * @swagger
 * /api/user-note/{film_id}/{user_id}/{user-note_id}:
 *   delete:
 *     summary: Supprime un film de la liste d'un utilisateur
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: object
 *         required: true
 *         description: Identifiant numérique de l'association film - utilisateur
 *     responses:
 *       204:
 *         description: Succès
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:user-note_id', checkIdParam, user_noteControllers.deleteUser_note);

export default router;