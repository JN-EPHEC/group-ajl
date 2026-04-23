import type { Request, Response, NextFunction } from "express";

export const checkIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  for (const key in req.params) {
    if (isNaN(Number(req.params[key]))) {
      return res.status(400).json({
        error: `Le paramètre ${key} doit être numérique`
      });
    }
  }

  next();
};