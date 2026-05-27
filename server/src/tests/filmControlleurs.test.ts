/**
 Tests unitaires — controllers/filmControllers.ts
 Stratégie : mock de Sequelize (Film, Realisateur, Genre, User_note, sequelize)
            afin d'éviter toute connexion BDD réelle.
 Fonctions couvertes :
    getAllFilms — succès + erreur 500
    getFilmById — trouvé (200) + non trouvé (404) + erreur 500
    createFilm — succès (201) + erreur 500
    deleteFilm — supprimé (204) + non trouvé (404) + erreur 500
    getActeursByFilms — 501
    getGenresByFilms — 501
 */
import Film from "../models/Films";
import {
    getAllFilms,
    getFilmById,
    createFilm,
    deleteFilm,
    getActeursByFilms,
    getGenresByFilms,
} from "../controllers/filmControllers";

//Aides

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
const mockReq = (overrides: object = {}) => ({ params: {}, body: {}, ...overrides });
beforeEach(() => jest.clearAllMocks());

//Mocks Sequelize
jest.mock("../config/database", () => ({
    __esModule: true,
    default: {
        define: jest.fn(),
        fn: jest.fn(),
        col: jest.fn(),
    },
}));

jest.mock("../models/Films", () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.mock("../models/Realisateurs", () => ({
    __esModule: true,
    default: {},
}));

jest.mock("../models/Genres", () => ({
    __esModule: true,
    default: {},
}));

jest.mock("../models/Users_notes", () => ({
    __esModule: true,
    default: {},
}));

jest.mock("../models/Acteurs", () => ({
    __esModule: true,
    default: {},
}));

// getAllFilms
describe("getAllFilms", () => {
    it("retourne 200 avec la liste des films", async () => {
        const films = [{ id_film: 1, titre: "Inception" }];
        (Film.findAll as jest.Mock).mockResolvedValue(films);
        const req = mockReq() as any;
        const res = mockRes();
        await getAllFilms(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(films);
    });
    it("retourne 500 en cas d'erreur BDD", async () => {
        (Film.findAll as jest.Mock).mockRejectedValue(new Error("DB down"));
        const req = mockReq() as any;
        const res = mockRes();
        await getAllFilms(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// getFilmById
describe("getFilmById", () => {
    it("retourne 200 si le film existe", async () => {
        const film = { id_film: 1, titre: "Matrix" };
        (Film.findByPk as jest.Mock).mockResolvedValue(film);
        const req = mockReq({ params: { id: "1" } }) as any;
        const res = mockRes();
        await getFilmById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(film);
    });
    it("retourne 404 si film non trouvé", async () => {
        (Film.findByPk as jest.Mock).mockResolvedValue(null);
        const req = mockReq({ params: { id: "999" } }) as any;
        const res = mockRes();
        await getFilmById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Film non trouvé" });
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Film.findByPk as jest.Mock).mockRejectedValue(new Error("boom"));
        const req = mockReq({ params: { id: "1" } }) as any;
        const res = mockRes();
        await getFilmById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// createFilm
describe("createFilm", () => {
    it("retourne 201 avec le film créé", async () => {
        const nouveau = { id_film: 5, titre: "Dune" };
        (Film.create as jest.Mock).mockResolvedValue(nouveau);
        const req = mockReq({ body: { titre: "Dune" } }) as any;
        const res = mockRes();
        await createFilm(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(nouveau);
    });
    it("retourne 500 si la création échoue", async () => {
        (Film.create as jest.Mock).mockRejectedValue(new Error("constraint"));
        const req = mockReq({ body: {} }) as any;
        const res = mockRes();
        await createFilm(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// deleteFilm
describe("deleteFilm", () => {
    it("retourne 204 si le film est supprimé", async () => {
        (Film.destroy as jest.Mock).mockResolvedValue(1);
        const req = mockReq({ params: { id: "1" } }) as any;
        const res = mockRes();
        await deleteFilm(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });
    it("retourne 404 si aucun film supprimé", async () => {
        (Film.destroy as jest.Mock).mockResolvedValue(0);
        const req = mockReq({ params: { id: "999" } }) as any;
        const res = mockRes();
        await deleteFilm(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Film.destroy as jest.Mock).mockRejectedValue(new Error("err"));
        const req = mockReq({ params: { id: "1" } }) as any;
        const res = mockRes();
        await deleteFilm(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// Placeholders non implémentés
describe("getActeursByFilms", () => {
    it("retourne 501 Non implémenté", async () => {
        const req = mockReq() as any;
        const res = mockRes();
        await getActeursByFilms(req, res);
        expect(res.status).toHaveBeenCalledWith(501);
    });
});

describe("getGenresByFilms", () => {
    it("retourne 501 Non implémenté", async () => {
        const req = mockReq() as any;
        const res = mockRes();
        await getGenresByFilms(req, res);
        expect(res.status).toHaveBeenCalledWith(501);
    });
});