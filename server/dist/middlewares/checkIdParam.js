export const checkIdParam = (req, res, next) => {
    if (isNaN(Number(req.params.id))) {
        const msg = "Mauvais Id";
        return res.status(400).json({ msg });
    }
    next();
};
//# sourceMappingURL=checkIdParam.js.map