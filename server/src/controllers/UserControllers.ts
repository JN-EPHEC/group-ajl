import type { Request, Response } from "express";
import Users_watchlist from "../models/Users_watchlists";
import Users from "../models/Users";
import Film from "../models/Films";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try{
        await Users.create({pseudonyme : req.body.pseudonyme, mail: req.body.mail, motdepasse: req.body.motdepasse});
        res.status(201).json(req.body);
    } catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const getUsers_watchlist = async (req: Request, res: Response) => {
    try {

        const users_watchlist = await Users_watchlist.findAll({
            where:
                {
                    user_id: req.params['user_id']
                }
        });
        res.status(200).json(users_watchlist);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const addFilmToUsersWatchlist = async (req: Request, res: Response) => {
    try {
        const { user_id, film_id } = req.body;

        const user = await Users.findByPk(user_id);
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

        const date_ajd = new Date();
        const ajoutFilm = await Users_watchlist.create({
            user_id: user_id,
            film_id: film_id,
            date_ajout: date_ajd
        });

        res.status(201).json(ajoutFilm);

    } catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try{
        await Users.destroy({
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

export const supprimerFilmDeWatchlist = async (req: Request, res: Response) => {
    try {
        const { user_id, film_id } = req.params;

        const deleted = await Users_watchlist.destroy({
            where: {
                user_id: user_id,
                film_id: film_id
            }
        });

        if (deleted === 0) {
            return res.status(404).json({
                error: "Utilisateur introuvable ou film introuvable dans la watchlist"
            });
        }

        res.status(204).send();

    } catch (error) {
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};