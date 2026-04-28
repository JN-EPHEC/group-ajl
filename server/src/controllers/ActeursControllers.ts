import type { Request, Response } from "express";
import Acteurs from "../models/Acteurs";

export const getAllActeurs = async (req: Request, res: Response) => {
    try {
        const reals = await Acteurs.findAll();
        res.status(200).json(reals);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createActeurs = async (req: Request, res: Response) => {
    try{
        await Acteurs.create({acteur_id : req.body.acteur_id, nom: req.body.nom, prenom: req.body.prenom});
        res.status(201).json(req.body);
    } catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};

export const deleteActeurs = async (req: Request, res: Response) => {
    try{
        await Acteurs.destroy({
            where: {
                acteur_id: req.params['acteur_id']
            }
        });
        res.status(204).json(req.body);

    }catch (error){
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};