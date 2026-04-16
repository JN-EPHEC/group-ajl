import Film from "../models/Films";
export const getAllFilms = async (req, res) => {
    try {
        const films = await Film.findAll();
        res.status(200).json(films);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createFilm = async (req, res) => {
    try {
        const date_ajd = new Date();
        await Film.create({ titre: req.body.titre, dateDeSortie: req.body.dateDeSortie, realisateur: req.body.realisateur,
            duree: req.body.duree, genres: req.body.genres, acteurs: req.body.acteurs, moyenne: req.body.moyenne });
        res.status(201).json(req.body);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};
export const deleteFilm = async (req, res) => {
    try {
        await Film.destroy({
            where: {
                id: req.params['id']
            }
        });
        res.status(204).json(req.body);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};
//# sourceMappingURL=filmControllers.js.map