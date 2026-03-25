import type { Request, Response, NextFunction } from 'express';

export const checkIdParam = (req: Request, res: Response, next: NextFunction) => {
    if (isNaN(Number(req.params.id))){
        
        const msg = "Mauvais Id";
        return res.status(400).json({msg});
    }
    next();
};