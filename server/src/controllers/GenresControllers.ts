import type { Request, Response } from "express";
import Genres from "../models/Genres";

export const getAllGenres = async (req: Request, res: Response) => {
    try {
        const reals = await Genres.findAll();
        res.status(200).json(reals);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createGenre = async (req: Request, res: Response) => {
    try{
        await Genres.create({genre_id : req.body.genre_id, nom: req.body.nom });
        res.status(201).json(req.body);
    } catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const deleteGenres = async (req: Request, res: Response) => {
    try{
        await Genres.destroy({
            where: {
                genre_id: req.params['genre_id']
            }
        });
        res.status(204).json(req.body);

    }catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};