import type { Request, Response } from "express";
import Acteurs_films from "../models/Acteurs_films";
import Acteur from "../models/Acteurs";
import Film from "../models/Films";

export const getAllActeurs_films = async (req: Request, res: Response) => {
    try {
        const films = await Acteurs_films.findAll();
        res.status(200).json(films);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createActeurs_films = async (req: Request, res: Response) => {
    try {
        const { acteur_id, film_id } = req.body;

        const user = await Acteur.findByPk(acteur_id);
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

        const nouveauActeurs_films = await Acteurs_films.create({
            acteur_id: acteur_id,
            film_id: film_id
        });

        res.status(201).json(nouveauActeurs_films);

    } catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const deleteActeurs_films = async (req: Request, res: Response) => {
    try {
        const { acteur_id, film_id } = req.params;

        const deleted = await Acteurs_films.destroy({
            where: {
                acteur_id: acteur_id,
                film_id: film_id
            }
        });

        if (deleted === 0) {
            return res.status(404).json({
                error: "Note introuvable"
            });
        }

        res.status(204).send();

    } catch (error) {
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};