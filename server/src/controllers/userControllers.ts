import type { Request, Response } from "express";
import User from "../models/User";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try{
        const date_ajd = new Date();
        await User.create({nom : req.body.nom, prenom : req.body.prenom, createdAt : date_ajd.toLocaleDateString(), updatedAt : date_ajd.toLocaleDateString()});
        res.status(201).json(req.body);
    } catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try{
        await User.destroy({
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