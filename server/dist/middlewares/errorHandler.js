export const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    const msg = err.message || "Erreur serveur";
    res.status(status).json({ msg });
};
//# sourceMappingURL=errorHandler.js.map