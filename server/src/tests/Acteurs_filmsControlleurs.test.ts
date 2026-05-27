/**
 Tests unitaires de Acteurs_filmsControllers.ts/
 */

import Acteurs_films from "../models/Acteurs_films";
import Acteur        from "../models/Acteurs";
import Film          from "../models/Films";
import { getAllActeurs_films, createActeurs_films, deleteActeurs_films } from "../controllers/Acteurs_filmsControllers";

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    res.send   = jest.fn().mockReturnValue(res);
    return res;
};
const mockReq = (o: object = {}) => ({ params: {}, body: {}, ...o });

beforeEach(() => jest.clearAllMocks());

//Mocks
jest.mock("../config/database", () => ({
    __esModule: true,
    default: { define: jest.fn(), fn: jest.fn(), col: jest.fn() },
}));

jest.mock("../models/Acteurs_films", () => ({
    __esModule: true,
    default: { findAll: jest.fn(), create: jest.fn(), destroy: jest.fn() },
}));

jest.mock("../models/Acteurs", () => ({
    __esModule: true,
    default: { findByPk: jest.fn() },
}));

jest.mock("../models/Films", () => ({
    __esModule: true,
    default: { findByPk: jest.fn() },
}));

//test
describe("getAllActeurs_films", () => {
    it("retourne 200 avec la liste", async () => {
        (Acteurs_films.findAll as jest.Mock).mockResolvedValue([{ acteur_id: 1, film_id: 2 }]);
        const res = mockRes();
        await getAllActeurs_films(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ acteur_id: 1, film_id: 2 }]);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Acteurs_films.findAll as jest.Mock).mockRejectedValue(new Error("db"));
        const res = mockRes();
        await getAllActeurs_films(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});


describe("createActeurs_films", () => {
    it("retourne 404 si l'acteur n'existe pas", async () => {
        (Acteur.findByPk as jest.Mock).mockResolvedValue(null);
        const res = mockRes();
        await createActeurs_films(mockReq({ body: { acteur_id: 99, film_id: 1 } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Utilisateur introuvable" });
    });
    it("retourne 404 si le film n'existe pas", async () => {
        (Acteur.findByPk as jest.Mock).mockResolvedValue({ acteur_id: 1 });
        (Film.findByPk as jest.Mock).mockResolvedValue(null);
        const res = mockRes();
        await createActeurs_films(mockReq({ body: { acteur_id: 1, film_id: 99 } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Film introuvable" });
    });
    it("retourne 201 si acteur et film existent", async () => {
        (Acteur.findByPk as jest.Mock).mockResolvedValue({ acteur_id: 1 });
        (Film.findByPk as jest.Mock).mockResolvedValue({ film_id: 2 });
        const liaison = { acteur_id: 1, film_id: 2 };
        (Acteurs_films.create as jest.Mock).mockResolvedValue(liaison);
        const res = mockRes();
        await createActeurs_films(mockReq({ body: { acteur_id: 1, film_id: 2 } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(liaison);
    });
    it("retourne 500 en cas d'erreur serveur", async () => {
        (Acteur.findByPk as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await createActeurs_films(mockReq({ body: { acteur_id: 1, film_id: 1 } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

//suppression
describe("deleteActeurs_films", () => {
    it("retourne 204 si la liaison est supprimée", async () => {
        (Acteurs_films.destroy as jest.Mock).mockResolvedValue(1);
        const res = mockRes();
        await deleteActeurs_films(mockReq({ params: { acteur_id: "1", film_id: "2" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });
    it("retourne 404 si la liaison n'existe pas", async () => {
        (Acteurs_films.destroy as jest.Mock).mockResolvedValue(0);
        const res = mockRes();
        await deleteActeurs_films(mockReq({ params: { acteur_id: "1", film_id: "99" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Note introuvable" });
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Acteurs_films.destroy as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await deleteActeurs_films(mockReq({ params: { acteur_id: "1", film_id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});