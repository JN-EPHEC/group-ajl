import {Router, type Request, type Response} from 'express';
import * as filmControllers from "../controllers/filmControllers.js";
import { checkIdParam } from '../middlewares/checkIdParam.js';


const router = Router();

/**
* @swagger
* /api/films:
*   get:
*       summary: Récupère la liste des films
*       tags: [Films]
*       responses:
*           200:
*               description: Succès
*           500:
*               description: Erreur serveur
*/
router.get("/", filmControllers.getAllFilms);

/**
* @swagger
* /api/films:
*   post:
*       summary: Ajoute un film à la liste des films
*       tags: [Films]
*       responses:
*           201:
*               description: Succès
*           500:
*               description: Erreur serveur
*/
router.post('/', filmControllers.createFilm);

/**
 * @swagger
 * /api/films/{id}:
 *   delete:
 *     summary: Supprime un film
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: object
 *         required: true
 *         description: Identifiant numérique du film
 *     responses:
 *       204:
 *         description: Succès
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', checkIdParam, filmControllers.deleteFilm);

export default router;