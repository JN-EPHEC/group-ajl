import type { Request, Response } from "express";
import sequelize from '../config/database.js';
import Film from '../models/Films.js';
import Realisateur from '../models/Realisateurs.js';
import Genre from '../models/Genres.js';
import User_note from '../models/Users_notes.js';
import Acteur from '../models/Acteurs.js'; 

// 1. Récupérer tous les films
export const getAllFilms = async (req: Request, res: Response) => {
    try {
        const films = await Film.findAll({
            attributes: {
                include: [
                    [sequelize.fn('AVG', sequelize.col('User_notes.note')), 'moyenne']
                ]
            },
            include: [
                { model: Realisateur },
                { 
                    model: Genre,
                    through: { attributes: [] } 
                },
                { 
                    model: User_note, 
                    attributes: [] 
                }
            ],
            group: [
                'Film.id_film', 
                'Realisateur.id_real', 
                'Genres.id_genre', 
                'Genres->Genres_films.id_genre', 
                'Genres->Genres_films.id_film'
            ]
        });

        res.status(200).json(films);
    } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 2. Récupérer un film par son ID 
export const getFilmById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);

        const film = await Film.findByPk(id, {
            attributes: {
                include: [
                    [
                        
                        sequelize.fn('AVG', sequelize.col('User_notes.note')), 
                        'moyenne'
                    ]
                ]
            },
            include: [
                { model: Realisateur, attributes: ['id_real','nom', 'prenom'] },
                { model: Genre, attributes: ['nom'], through: { attributes: [] } },
                { model: Acteur, attributes: ['id_acteurs','nom', 'prenom'], through: { attributes: [] } },
                { model: User_note, attributes: [] }
            ],
            
            group: [
                'Film.id_film', 
                'Realisateur.id_real',
                'Genres.id_genre',
                'Acteurs.id_acteurs'
            ] 
        });

        if (film) {
            res.status(200).json(film);
        } else {
            res.status(404).json({ message: "Film non trouvé" });
        }
    } catch (error) {
        console.error("Erreur dans getFilmById :", error);
        res.status(500).json({ error: (error as any).message });
    }
};

// 3. Créer un film 
export const createFilm = async (req: Request, res: Response) => {
    try {
        const nouveauFilm = await Film.create(req.body);
        res.status(201).json(nouveauFilm);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

// 4. Supprimer un film 
export const deleteFilm = async (req: Request, res: Response) => {
    try {
        // ✅ CORRECTION : id_film au lieu de film_id
        const deleted = await Film.destroy({ where: { id_film: req.params.id } });
        if (deleted) res.status(204).send();
        else res.status(404).json({ message: "Film non trouvé" });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

// 5. Fonctions manquantes (Placeholders)
export const getActeursByFilms = async (req: Request, res: Response) => {
    res.status(501).json({ message: "Non implémenté" });
};

export const getGenresByFilms = async (req: Request, res: Response) => {
    res.status(501).json({ message: "Non implémenté" });
};