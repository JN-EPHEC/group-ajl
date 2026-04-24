import type { Request, Response } from "express";
import Reals from "../models/Realisateurs";

export const getAllReals = async (req: Request, res: Response) => {
    try {
        const reals = await Reals.findAll();
        res.status(200).json(reals);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createReal = async (req: Request, res: Response) => {
    try{
        await Reals.create({realisateur_id : req.body.realisateur_id, nom: req.body.nom, prenom: req.body.prenom});
        res.status(201).json(req.body);
    } catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const deleteReal = async (req: Request, res: Response) => {
    try{
        await Reals.destroy({
            where: {
                realisateur_id: req.params['realisateur_id']
            }
        });
        res.status(204).json(req.body);

    }catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};