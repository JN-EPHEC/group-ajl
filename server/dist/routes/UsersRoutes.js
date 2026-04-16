import { Router } from 'express';
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
* /api/films:
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
 * /api/films/{id}:
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
export default router;
//# sourceMappingURL=UsersRoutes.js.map