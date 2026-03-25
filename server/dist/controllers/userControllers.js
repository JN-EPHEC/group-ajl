import User from "../models/User";
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createUser = async (req, res) => {
    try {
        const date_ajd = new Date();
        await User.create({ nom: req.body.nom, prenom: req.body.prenom, createdAt: date_ajd.toLocaleDateString(), updatedAt: date_ajd.toLocaleDateString() });
        res.status(201).json(req.body);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Erreur serveur");
    }
};
export const deleteUser = async (req, res) => {
    try {
        await User.destroy({
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
//# sourceMappingURL=userControllers.js.map