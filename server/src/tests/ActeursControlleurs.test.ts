/**
 Tests unitaires de ActeursControllers.ts/
 */
import Acteurs from "../models/Acteurs";
import { getAllActeurs, createActeurs, deleteActeurs } from "../controllers/ActeursControllers";

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

jest.mock("../models/Acteurs", () => ({
    __esModule: true,
    default: { findAll: jest.fn(), create: jest.fn(), destroy: jest.fn() },
}));

//test
describe("getAllActeurs", () => {
    it("retourne 200 avec la liste des acteurs", async () => {
        (Acteurs.findAll as jest.Mock).mockResolvedValue([{ acteur_id: 1, nom: "Hanks" }]);
        const res = mockRes();
        await getAllActeurs(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ acteur_id: 1, nom: "Hanks" }]);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Acteurs.findAll as jest.Mock).mockRejectedValue(new Error("db error"));
        const res = mockRes();
        await getAllActeurs(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("createActeurs", () => {
    it("retourne 201 avec le body envoyé", async () => {
        (Acteurs.create as jest.Mock).mockResolvedValue({});
        const body = { acteur_id: 1, nom: "Hanks", prenom: "Tom" };
        const res  = mockRes();
        await createActeurs(mockReq({ body }) as any, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(body);
    });
    it("retourne 500 si la création échoue", async () => {
        (Acteurs.create as jest.Mock).mockRejectedValue(new Error("constraint"));
        const res = mockRes();
        await createActeurs(mockReq({ body: {} }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("deleteActeurs", () => {
    it("retourne 204 après suppression", async () => {
        (Acteurs.destroy as jest.Mock).mockResolvedValue(1);
        const res = mockRes();
        await deleteActeurs(mockReq({ params: { acteur_id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Acteurs.destroy as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await deleteActeurs(mockReq({ params: { acteur_id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});