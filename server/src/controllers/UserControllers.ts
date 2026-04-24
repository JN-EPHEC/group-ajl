import type { Request, Response } from "express";
import Users from "../models/Users";

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