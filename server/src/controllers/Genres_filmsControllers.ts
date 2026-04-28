import type { Request, Response } from "express";
import Genres_films from "../models/Genres_films";
import Genres from "../models/Genres";
import Film from "../models/Films";

export const getAllGenres_films = async (req: Request, res: Response) => {
    try {
        const genres_films = await Genres_films.findAll();
        res.status(200).json(genres_films);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createGenres_films = async (req: Request, res: Response) => {
    try {
        const { genre_id, film_id } = req.body;

        const genre = await Genres.findByPk(genre_id);
        if (!genre) {
            return res.status(404).json({
                error: "Genre introuvable"
            });
        }

        const film = await Film.findByPk(film_id);
        if (!film) {
            return res.status(404).json({
                error: "Film introuvable"
            });
        }

        const nouveauGenres_films = await Genres_films.create({
            genre_id: genre_id,
            film_id: film_id
        });

        res.status(201).json(nouveauGenres_films);

    } catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const deleteGenres_films = async (req: Request, res: Response) => {
    try {
        const { genre_id, film_id } = req.params;

        const deleted = await Genres_films.destroy({
            where: {
                genre_id: genre_id,
                film_id: film_id
            }
        });

        if (deleted === 0) {
            return res.status(404).json({
                error: "Genres_films introuvable"
            });
        }

        res.status(204).send();

    } catch (error) {
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};