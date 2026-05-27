/**
 Tests unitaires de RealisateursControllers.ts/
 */

import Reals from "../models/Realisateurs";
import { getAllReals, createReal, deleteReal } from "../controllers/RealisateursControllers";

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
jest.mock("../models/Realisateurs", () => ({
    __esModule: true,
    default: { findAll: jest.fn(), create: jest.fn(), destroy: jest.fn() },
}));

//test
describe("getAllReals", () => {
    it("retourne 200 avec la liste des réalisateurs", async () => {
        (Reals.findAll as jest.Mock).mockResolvedValue([{ realisateur_id: 1, nom: "Nolan" }]);
        const res = mockRes();
        await getAllReals(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ realisateur_id: 1, nom: "Nolan" }]);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Reals.findAll as jest.Mock).mockRejectedValue(new Error("db error"));
        const res = mockRes();
        await getAllReals(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

//création d'un réalisateur
describe("createReal", () => {
    it("retourne 201 avec le body envoyé", async () => {
        (Reals.create as jest.Mock).mockResolvedValue({});
        const body = { realisateur_id: 1, nom: "Nolan", prenom: "Christopher" };
        const res  = mockRes();
        await createReal(mockReq({ body }) as any, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(body);
    });
    it("retourne 500 si la création échoue", async () => {
        (Reals.create as jest.Mock).mockRejectedValue(new Error("constraint"));
        const res = mockRes();
        await createReal(mockReq({ body: {} }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

//supression
describe("deleteReal", () => {
    it("retourne 204 après suppression", async () => {
        (Reals.destroy as jest.Mock).mockResolvedValue(1);
        const res = mockRes();
        await deleteReal(mockReq({ params: { realisateur_id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Reals.destroy as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await deleteReal(mockReq({ params: { realisateur_id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});