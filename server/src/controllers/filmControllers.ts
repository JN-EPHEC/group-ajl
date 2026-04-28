import type { Request, Response } from "express";
import Film from "../models/Films";
import Acteurs from '../models/Acteurs';
import Acteurs_films from '../models/Acteurs_films';
import Genres from "../models/Genres";
import Genres_films from "../models/Genres_films";

export const getAllFilms = async (req: Request, res: Response) => {
    try {
        const films = await Film.findAll();
        res.status(200).json(films);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};


export const getActeursByFilms = async (req: Request, res: Response) => {
    try {

        const liens = await Acteurs_films.findAll({
            where: 
            { 
                film_id: req.params['film_id'], 
            }
        });

        const ids = liens.map((l: any) => l.acteur_id);

        const acteurs = await Acteurs.findAll({
            where: {
                acteur_id: ids
             }
});

    res.status(200).json(acteurs);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const getGenresByFilms = async (req: Request, res: Response) => {
    try {

        const liens = await Genres_films.findAll({
            where: 
            { 
                film_id: req.params['film_id'], 
            }
        });

        const ids = liens.map((l: any) => l.genre_id);

        const genres = await Genres.findAll({
            where: {
                genre_id: ids
             }
});

    res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createFilm = async (req: Request, res: Response) => {
    try{
        await Film.create({titre : req.body.titre, dateDeSortie : req.body.dateDeSortie, realisateur_id: req.body.realisateur_id, 
            duree_minute: req.body.duree_minute});
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