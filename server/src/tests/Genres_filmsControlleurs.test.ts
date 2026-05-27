/**
 Tests unitaires de Genres_filmsControllers.ts/
 */
import Genres_films from "../models/Genres_films";
import Genres       from "../models/Genres";
import Film         from "../models/Films";
import { getAllGenres_films, createGenres_films, deleteGenres_films } from "../controllers/Genres_filmsControllers";

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
jest.mock("../models/Genres_films", () => ({
    __esModule: true,
    default: { findAll: jest.fn(), create: jest.fn(), destroy: jest.fn() },
}));
jest.mock("../models/Genres", () => ({
    __esModule: true,
    default: { findByPk: jest.fn() },
}));
jest.mock("../models/Films", () => ({
    __esModule: true,
    default: { findByPk: jest.fn() },
}));


//test
describe("getAllGenres_films", () => {
    it("retourne 200 avec la liste", async () => {
        (Genres_films.findAll as jest.Mock).mockResolvedValue([{ genre_id: 1, film_id: 2 }]);
        const res = mockRes();
        await getAllGenres_films(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ genre_id: 1, film_id: 2 }]);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Genres_films.findAll as jest.Mock).mockRejectedValue(new Error("db"));
        const res = mockRes();
        await getAllGenres_films(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

//creation d'un film
describe("createGenres_films", () => {
    it("retourne 404 si le genre n'existe pas", async () => {
        (Genres.findByPk as jest.Mock).mockResolvedValue(null);
        const res = mockRes();
        await createGenres_films(mockReq({ body: { genre_id: 99, film_id: 1 } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Genre introuvable" });
    });
    it("retourne 404 si le film n'existe pas", async () => {
        (Genres.findByPk as jest.Mock).mockResolvedValue({ genre_id: 1 });
        (Film.findByPk as jest.Mock).mockResolvedValue(null);
        const res = mockRes();
        await createGenres_films(mockReq({ body: { genre_id: 1, film_id: 99 } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Film introuvable" });
    });
    it("retourne 201 si genre et film existent", async () => {
        (Genres.findByPk as jest.Mock).mockResolvedValue({ genre_id: 1 });
        (Film.findByPk as jest.Mock).mockResolvedValue({ film_id: 2 });
        const liaison = { genre_id: 1, film_id: 2 };
        (Genres_films.create as jest.Mock).mockResolvedValue(liaison);
        const res = mockRes();
        await createGenres_films(mockReq({ body: { genre_id: 1, film_id: 2 } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(liaison);
    });
    it("retourne 500 en cas d'erreur serveur", async () => {
        (Genres.findByPk as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await createGenres_films(mockReq({ body: { genre_id: 1, film_id: 1 } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

//suppresion
describe("deleteGenres_films", () => {
    it("retourne 204 si la liaison est supprimée", async () => {
        (Genres_films.destroy as jest.Mock).mockResolvedValue(1);
        const res = mockRes();
        await deleteGenres_films(mockReq({ params: { genre_id: "1", film_id: "2" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });
    it("retourne 404 si la liaison n'existe pas", async () => {
        (Genres_films.destroy as jest.Mock).mockResolvedValue(0);
        const res = mockRes();
        await deleteGenres_films(mockReq({ params: { genre_id: "1", film_id: "99" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Genres_films introuvable" });
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Genres_films.destroy as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await deleteGenres_films(mockReq({ params: { genre_id: "1", film_id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});