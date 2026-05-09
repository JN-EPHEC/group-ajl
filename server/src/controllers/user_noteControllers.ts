import type { Request, Response } from "express";
import UserNote from "../models/Users_notes.js"; 
import User from "../models/Users.js";
import Film from "../models/Films.js";

// 1. Récupérer toutes les notes
export const getAllUser_note = async (req: Request, res: Response) => {
    try {
        const notes = await UserNote.findAll({
            include: [
                { model: Film, attributes: ['titre'] },
                { model: User, attributes: ['pseudonyme'] } // Optionnel : pour savoir qui a noté
            ] 
        });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

// 2. Créer une note
export const createUser_note = async (req: Request, res: Response) => {
    try {
        const { id_user, id_film, note, commentaire } = req.body;

        // Vérification de l'utilisateur
        const userExists = await User.findByPk(id_user);
        if (!userExists) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        // Vérification du film
        const filmExists = await Film.findByPk(id_film);
        if (!filmExists) {
            return res.status(404).json({ error: "Film introuvable" });
        }

        const nouvelleNote = await UserNote.create({
            id_user: id_user,
            id_film: id_film,
            note: note,
            commentaire: commentaire
        });

        res.status(201).json(nouvelleNote);

    } catch (error) {
        console.error("Erreur dans createUser_note :", error);
        res.status(500).json({ error: "Erreur serveur lors de la création de la note" });
    }
};

// 3. Supprimer une note
export const deleteUser_note = async (req: Request, res: Response) => {
    try {
        const { user_id, film_id } = req.params;

        const deleted = await UserNote.destroy({
            where: {
                id_user: user_id, // on associe la colonne id_user au paramètre user_id
                id_film: film_id  // on associe la colonne id_film au paramètre film_id
            }
        });

        if (deleted === 0) {
            return res.status(404).json({ error: "Note introuvable" });
        }

        res.status(204).send();

    } catch (error) {
        console.error("Erreur dans deleteUser_note :", error);
        res.status(500).send("Erreur serveur");
    }
};

// 4. Récupérer les notes par ID utilisateur
export const getNotesByUserId = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params as { user_id: string };

        const notes = await UserNote.findAll({
            where: { id_user: user_id },
            include: [
                { model: Film, attributes: ['titre'] }
            ]
        });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des notes" });
    }
};

// 5. Récupérer la note d'un utilisateur pour un film spécifique
export const getUserNoteForFilm = async (req: Request, res: Response) => {
    try {
        const { user_id, film_id } = req.params;
        const note = await UserNote.findOne({
            where: { id_user: user_id, id_film: film_id }
        });

        if (!note) {
            return res.status(200).json(null); 
        }

        return res.status(200).json(note);
    } catch (error) {
        return res.status(500).json({ error: "Erreur serveur" });
    }
};

// 6. Modifier une note existante
export const updateUser_note = async (req: Request, res: Response) => {
    try {
        const { user_id, film_id } = req.params;
        const { note, commentaire } = req.body;

        const [updated] = await UserNote.update(
            { note: note, commentaire: commentaire },
            { where: { id_user: user_id, id_film: film_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ error: "Note introuvable ou aucune modification effectuée" });
        }

        const updatedNote = await UserNote.findOne({
            where: { id_user: user_id, id_film: film_id }
        });

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Erreur dans updateUser_note :", error);
        res.status(500).json({ error: "Erreur serveur lors de la modification" });
    }
};

// --- 7. Récupérer TOUS les avis pour un film spécifique ---
export const getNotesForFilm = async (req: Request, res: Response) => {
    try {
        const { film_id } = req.params;

        const notes = await UserNote.findAll({
            where: { id_film: film_id },
            include: [{
                model: User,
                attributes: ['pseudonyme'] 
            }],

            order: [['id_user', 'DESC']] 
        });

        res.status(200).json(notes);
    } catch (error) {
        console.error("Erreur dans getNotesForFilm :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des avis" });
    }
};