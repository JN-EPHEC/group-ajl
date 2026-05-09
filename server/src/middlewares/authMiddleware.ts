import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    // Le token est généralement envoyé dans le header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ error: "Token requis" });

    jwt.verify(token, process.env.JWT_SECRET || "MON_SECRET_JWT", (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token invalide" });
        // On peut stocker l'ID décodé dans la requête si on en a besoin plus tard
        (req as any).user = decoded; 
        next();
    });
};