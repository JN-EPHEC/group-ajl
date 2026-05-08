import type { Request, Response } from "express";
import Film from '../models/Films.js';
import Realisateur from '../models/Realisateurs.js';
import Genre from '../models/Genres.js';
import User_note from '../models/Users_notes.js';
import Acteur from '../models/Acteurs.js';
import { Sequelize } from 'sequelize'; 

// 1. Récupérer tous les films (déjà fait)
export const getAllFilms = async (req: Request, res: Response) => {
    try {
        const films = await Film.findAll({
            attributes: {
                include: [
                    [
                        Sequelize.fn('AVG', Sequelize.col('Users_notes.note')), 
                        'moyenne'
                    ]
                ]
            },
            include: [
                { 
                    model: Realisateur, 
                    attributes: ['nom', 'prenom'] 
                },
                { 
                    model: Genre, 
                    attributes: ['nom'], 
                    through: { attributes: [] } 
                },
                { 
                    model: User_note, 
                    attributes: [] 
                }
            ],
            group: ['Films.film_id'],
            subQuery: false 
        });

        res.status(200).json(films);
    } catch (error) {
        console.error("ERREUR SQL :", error); 
        res.status(500).json({ error: (error as any).message });
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
                        Sequelize.fn('AVG', Sequelize.col('Users_notes.note')), 
                        'moyenne'
                    ]
                ]
            },
            include: [
                { model: Realisateur, attributes: ['nom', 'prenom'] },
                { model: Genre, attributes: ['nom'], through: { attributes: [] } },
                { model: Acteur, attributes: ['nom', 'prenom'], through: { attributes: [] } },
                { model: User_note, attributes: [] } // Obligatoire pour que le AVG fonctionne
            ],
           
            group: ['Films.film_id', 'Realisateur.realisateur_id'] 
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
        const deleted = await Film.destroy({ where: { film_id: req.params.id } });
        if (deleted) res.status(204).send();
        else res.status(404).json({ message: "Film non trouvé" });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

// 5. Placeholders pour les fonctions manquantes 
export const getActeursByFilms = async (req: Request, res: Response) => {
    res.status(501).json({ message: "Non implémenté" });
};

export const getGenresByFilms = async (req: Request, res: Response) => {
    res.status(501).json({ message: "Non implémenté" });
};