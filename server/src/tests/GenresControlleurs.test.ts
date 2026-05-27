/**
 Tests unitaires de GenresControllers.ts/
 */

import Genres from "../models/Genres";
import { getAllGenres, createGenre, deleteGenres } from "../controllers/GenresControllers";

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
jest.mock("../models/Genres", () => ({
    __esModule: true,
    default: { findAll: jest.fn(), create: jest.fn(), destroy: jest.fn() },
}));

//test
describe("getAllGenres", () => {
    it("retourne 200 avec la liste des genres", async () => {
        (Genres.findAll as jest.Mock).mockResolvedValue([{ genre_id: 1, nom: "Action" }]);
        const res = mockRes();
        await getAllGenres(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ genre_id: 1, nom: "Action" }]);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Genres.findAll as jest.Mock).mockRejectedValue(new Error("db error"));
        const res = mockRes();
        await getAllGenres(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

//création
describe("createGenre", () => {
    it("retourne 201 avec le body envoyé", async () => {
        (Genres.create as jest.Mock).mockResolvedValue({});
        const body = { genre_id: 1, nom: "Action" };
        const res  = mockRes();
        await createGenre(mockReq({ body }) as any, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(body);
    });
    it("retourne 500 si la création échoue", async () => {
        (Genres.create as jest.Mock).mockRejectedValue(new Error("constraint"));
        const res = mockRes();
        await createGenre(mockReq({ body: {} }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

//suppression
describe("deleteGenres", () => {
    it("retourne 204 après suppression", async () => {
        (Genres.destroy as jest.Mock).mockResolvedValue(1);
        const res = mockRes();
        await deleteGenres(mockReq({ params: { genre_id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Genres.destroy as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await deleteGenres(mockReq({ params: { genre_id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});