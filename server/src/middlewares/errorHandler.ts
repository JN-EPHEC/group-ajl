import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    const status = err.status || 500;
    const msg = err.message || "Erreur serveur";
    res.status(status).json({msg})
};