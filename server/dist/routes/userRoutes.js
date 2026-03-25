import { Router } from 'express';
import User from '../models/User.js';
import * as userController from "../controllers/userControllers.js";
import { checkIdParam } from '../middlewares/checkIdParam.js';
const router = Router();
/**
* @swagger
* /api/users:
*   get:
*       summary: Récupère la liste des utilisateurs
*       tags: [Users]
*       responses:
*           200:
*               description: Succès
*           500:
*               description: Erreur serveur
*/
router.get("/", userController.getAllUsers);
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
router.post('/', userController.createUser);
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
 *           type: integer
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
router.delete('/:id', checkIdParam, userController.deleteUser);
export default router;
//# sourceMappingURL=userRoutes.js.map