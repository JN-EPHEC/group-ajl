import type { Request, Response } from "express";
import Acteurs from "../models/Acteurs";
import Films from '../models/Films';

export const getAllActeurs = async (req: Request, res: Response) => {
    try {
        const reals = await Acteurs.findAll();
        res.status(200).json(reals);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

// Récupérer les films d'un acteur
export const getFilmsByActeurs = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id_acteurs as string, 10);

        const films = await Films.findAll({
            include: [
                {
                    model: Acteurs,
                    through: { attributes: [] },
                    required: true
                }
            ]
        });

        // filtre côté JS (plus safe si jointure complexe)
        const filteredFilms = films.filter((film: any) =>
            film.Acteurs?.some((a: any) => a.id_acteurs === id)
        );

        if (filteredFilms.length === 0) {
            return res.status(404).json({
                message: "Aucun film trouvé pour cet acteur"
            });
        }

        return res.status(200).json(filteredFilms);

    } catch (error) {
        console.error("Erreur dans getFilmsByActeurs :", error);

        return res.status(500).json({
            error: (error as any).message
        });
    }
};

export const createActeurs = async (req: Request, res: Response) => {
    try{
        await Acteurs.create({id_acteurs : req.body.id_acteurs, nom: req.body.nom, prenom: req.body.prenom});
        res.status(201).json(req.body);
    } catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const deleteActeurs = async (req: Request, res: Response) => {
    try{
        await Acteurs.destroy({
            where: {
                id_acteurs: req.params['id_acteurs']
            }
        });
        res.status(204).json(req.body);

    }catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};