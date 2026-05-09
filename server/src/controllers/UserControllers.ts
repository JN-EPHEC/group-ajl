import type { Request, Response } from "express";
import Users_watchlist from "../models/Users_watchlists.js";
import Users from "../models/Users.js";
import Film from "../models/Films.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 1. Récupérer tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

// 2. Créer un utilisateur (Inscription)
export const createUser = async (req: Request, res: Response) => {
    try {
        const { pseudonyme, mail, password } = req.body;
        
        // On hache le mot de passe avant l'insertion
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await Users.create({
            pseudonyme,
            mail,
            password_hash: hashedPassword // On enregistre le hash, pas le texte clair
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
};

// 3. Récupérer la watchlist d'un utilisateur
export const getUsers_watchlist = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params; 

        const watchlist = await Users_watchlist.findAll({
            where: {
                id_user: user_id // On cherche l'ID de l'URL dans la colonne id_user
            },
            include: [{ 
                model: Film, 
                attributes: ['id_film', 'titre', 'img', 'date_de_sortie'] 
            }]
        });
        res.status(200).json(watchlist);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

// 4. Ajouter un film à la watchlist
export const addFilmToUsersWatchlist = async (req: Request, res: Response) => {
    try {
        const user_id = req.params.user_id as string; 
        const { id_film } = req.body;

        // On convertit tout de suite en nombre pour être propre
        const userIdNum = parseInt(user_id, 10);

        const user = await Users.findByPk(userIdNum);
        if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

        const film = await Film.findByPk(id_film);
        if (!film) return res.status(404).json({ error: "Film introuvable" });

        const ajoutFilm = await Users_watchlist.create({
            id_user: userIdNum,
            id_film: id_film,
            date_ajout: new Date()
        });

        res.status(201).json(ajoutFilm);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de l'ajout" });
    }
};

// 5. Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Users.destroy({
            where: { id_user: id }
        });
        
        if (deleted) res.status(204).send();
        else res.status(404).json({ message: "Utilisateur non trouvé" });
    } catch (error){
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// 6. Retirer un film de la watchlist
export const supprimerFilmDeWatchlist = async (req: Request, res: Response) => {
    try {
        const { user_id, film_id } = req.params; 

        const deleted = await Users_watchlist.destroy({
            where: {
                id_user: user_id,
                id_film: film_id
            }
        });

        if (deleted === 0) {
            return res.status(404).json({ error: "Film non trouvé dans la watchlist" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params as { user_id: string }; 

        if (!user_id) {
            return res.status(400).json({ error: "ID manquant" });
        }

        const user = await Users.findByPk(user_id, {
            attributes: ['id_user', 'pseudonyme', 'mail']
        });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Fonction de connexion
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { mail, password } = req.body;

        // 1. Chercher l'utilisateur par son mail
        const user = await Users.findOne({ where: { mail } });
        if (!user) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect." });
        }

        const userData = user as any; 

        // 2. Vérifier si le mot de passe correspond au hachage
        const validPassword = await bcrypt.compare(password, userData.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect." });
        }

        // 3. Générer le JWT
        const token = jwt.sign(
            { id_user: userData.id_user }, 
            process.env.JWT_SECRET || "MON_SECRET_JWT", 
            { expiresIn: "24h" }
        );

        res.status(200).json({ 
            message: "Connexion réussie", 
            token, 
            user_id: userData.id_user 
        });
        
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur lors de la connexion" });
    }
};