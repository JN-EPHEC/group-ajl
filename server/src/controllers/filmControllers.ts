import type { Request, Response } from "express";
import Film from "../models/Films";

export const getAllFilms = async (req: Request, res: Response) => {
    try {
        const films = await Film.findAll();
        res.status(200).json(films);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createFilm = async (req: Request, res: Response) => {
    try{
        await Film.create({titre : req.body.titre, dateDeSortie : req.body.dateDeSortie, realisateur: req.body.realisateur, 
            duree: req.body.duree, genres: req.body.genres, acteurs: req.body.acteurs, moyenne: req.body.moyenne});
        res.status(201).json(req.body);
    } catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const deleteFilm = async (req: Request, res: Response) => {
    try{
        await Film.destroy({
            where: {
                id: req.params['id']
            }
        });
        res.status(204).json(req.body);

    }catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};