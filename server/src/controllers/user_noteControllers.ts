import type { Request, Response } from "express";
import user_note from "../models/user_note";
import User from "../models/User";
import Film from "../models/Films";

export const getAllUser_note = async (req: Request, res: Response) => {
    try {
        const films = await user_note.findAll();
        res.status(200).json(films);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createUser_note = async (req: Request, res: Response) => {
    try {
        const { user_id, film_id, note, commentaire } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                error: "Utilisateur introuvable"
            });
        }

        const film = await Film.findByPk(film_id);
        if (!film) {
            return res.status(404).json({
                error: "Film introuvable"
            });
        }

        const nouvelleNote = await user_note.create({
            user_id: user_id,
            film_id: film_id,
            note: note,
            commentaire: commentaire
        });

        res.status(201).json(nouvelleNote);

    } catch (error) {
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const deleteUser_note = async (req: Request, res: Response) => {
    try {
        await user_note.destroy({
            where: {
                id: req.params["id"]
            }
        });

        res.status(204).send();

    } catch (error) {
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};