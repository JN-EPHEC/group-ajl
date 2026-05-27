/**
 Tests unitaires — controllers/UserControllers.ts
 Fonctions couvertes :
    getAllUsers — succès + erreur
    createUser — succès + erreur
    getUsers_watchlist — succès + erreur
    addFilmToUsersWatchlist — user non trouvé + film non trouvé + succès + erreur
    deleteUser — supprimé + non trouvé + erreur
    supprimerFilmDeWatchlist — supprimé + non trouvé + erreur
    getUserById — trouvé + non trouvé + erreur (+ id manquant)
    loginUser — succès + mauvais mdp + user inexistant + erreur
 */

import Users from "../models/Users";
import Film from "../models/Films";
import Users_watchlist from "../models/Users_watchlists";
import bcrypt from "bcrypt";
import {
    getAllUsers,
    createUser,
    getUsers_watchlist,
    addFilmToUsersWatchlist,
    deleteUser,
    supprimerFilmDeWatchlist,
    getUserById,
    loginUser,
} from "../controllers/UserControllers";

// Aides
const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
const mockReq = (o: object = {}) => ({ params: {}, body: {}, ...o });

beforeEach(() => jest.clearAllMocks());
//Mocks

jest.mock("../config/database", () => ({
    __esModule: true,
    default: { define: jest.fn(), fn: jest.fn(), col: jest.fn() },
}));

jest.mock("../models/Users", () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.mock("../models/Films", () => ({
    __esModule: true,
    default: { findByPk: jest.fn() },
}));

jest.mock("../models/Users_watchlists", () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.mock("bcrypt", () => ({
    genSalt: jest.fn().mockResolvedValue("salt"),
    hash: jest.fn().mockResolvedValue("hashedpwd"),
    compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn().mockReturnValue("fake.jwt.token"),
}));

describe("getAllUsers", () => {
    it("retourne 200 avec la liste des users", async () => {
        (Users.findAll as jest.Mock).mockResolvedValue([{ id_user: 1 }]);
        const res = mockRes();
        await getAllUsers(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Users.findAll as jest.Mock).mockRejectedValue(new Error("db"));
        const res = mockRes();
        await getAllUsers(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("createUser", () => {
    it("retourne 201 avec le nouvel utilisateur", async () => {
        const user = { id_user: 1, pseudonyme: "Alice", mail: "a@b.com" };
        (Users.create as jest.Mock).mockResolvedValue(user);
        const req = mockReq({ body: { pseudonyme: "Alice", mail: "a@b.com", password: "pwd" } });
        const res = mockRes();
        await createUser(req as any, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(user);
    });
    it("retourne 500 si la création échoue", async () => {
        (Users.create as jest.Mock).mockRejectedValue(new Error("unique"));
        const res = mockRes();
        await createUser(mockReq({ body: {} }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("getUsers_watchlist", () => {
    it("retourne 200 avec la watchlist", async () => {
        (Users_watchlist.findAll as jest.Mock).mockResolvedValue([]);
        const req = mockReq({ params: { user_id: "1" } });
        const res = mockRes();
        await getUsers_watchlist(req as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Users_watchlist.findAll as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await getUsers_watchlist(mockReq({ params: { user_id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("addFilmToUsersWatchlist", () => {
    it("retourne 404 si l'utilisateur n'existe pas", async () => {
        (Users.findByPk as jest.Mock).mockResolvedValue(null);
        const req = mockReq({ params: { user_id: "99" }, body: { id_film: 1 } });
        const res = mockRes();
        await addFilmToUsersWatchlist(req as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Utilisateur introuvable" });
    });
    it("retourne 404 si le film n'existe pas", async () => {
        (Users.findByPk as jest.Mock).mockResolvedValue({ id_user: 1 });
        (Film.findByPk as jest.Mock).mockResolvedValue(null);
        const req = mockReq({ params: { user_id: "1" }, body: { id_film: 99 } });
        const res = mockRes();
        await addFilmToUsersWatchlist(req as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Film introuvable" });
    });
    it("retourne 201 si user et film existent", async () => {
        (Users.findByPk as jest.Mock).mockResolvedValue({ id_user: 1 });
        (Film.findByPk as jest.Mock).mockResolvedValue({ id_film: 2 });
        (Users_watchlist.create as jest.Mock).mockResolvedValue({ id_user: 1, id_film: 2 });
        const req = mockReq({ params: { user_id: "1" }, body: { id_film: 2 } });
        const res = mockRes();
        await addFilmToUsersWatchlist(req as any, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });
    it("retourne 500 en cas d'erreur serveur", async () => {
        (Users.findByPk as jest.Mock).mockRejectedValue(new Error("err"));
        const req = mockReq({ params: { user_id: "1" }, body: { id_film: 1 } });
        const res = mockRes();
        await addFilmToUsersWatchlist(req as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("deleteUser", () => {
    it("retourne 204 si supprimé", async () => {
        (Users.destroy as jest.Mock).mockResolvedValue(1);
        const res = mockRes();
        await deleteUser(mockReq({ params: { id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });
    it("retourne 404 si utilisateur non trouvé", async () => {
        (Users.destroy as jest.Mock).mockResolvedValue(0);
        const res = mockRes();
        await deleteUser(mockReq({ params: { id: "99" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Users.destroy as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await deleteUser(mockReq({ params: { id: "1" } }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("supprimerFilmDeWatchlist", () => {
    it("retourne 204 si le film est retiré", async () => {
        (Users_watchlist.destroy as jest.Mock).mockResolvedValue(1);
        const req = mockReq({ params: { user_id: "1", film_id: "2" } });
        const res = mockRes();
        await supprimerFilmDeWatchlist(req as any, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });
    it("retourne 404 si film non présent dans la watchlist", async () => {
        (Users_watchlist.destroy as jest.Mock).mockResolvedValue(0);
        const req = mockReq({ params: { user_id: "1", film_id: "99" } });
        const res = mockRes();
        await supprimerFilmDeWatchlist(req as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Users_watchlist.destroy as jest.Mock).mockRejectedValue(new Error("err"));
        const req = mockReq({ params: { user_id: "1", film_id: "1" } });
        const res = mockRes();
        await supprimerFilmDeWatchlist(req as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("getUserById", () => {
    it("retourne 200 si l'utilisateur est trouvé", async () => {
        (Users.findByPk as jest.Mock).mockResolvedValue({ id_user: 1, pseudonyme: "Bob" });
        const req = mockReq({ params: { user_id: "1" } });
        const res = mockRes();
        await getUserById(req as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("retourne 404 si utilisateur non trouvé", async () => {
        (Users.findByPk as jest.Mock).mockResolvedValue(null);
        const req = mockReq({ params: { user_id: "99" } });
        const res = mockRes();
        await getUserById(req as any, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (Users.findByPk as jest.Mock).mockRejectedValue(new Error("err"));
        const req = mockReq({ params: { user_id: "1" } });
        const res = mockRes();
        await getUserById(req as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("loginUser", () => {
    it("retourne 401 si l'email n'existe pas", async () => {
        (Users.findOne as jest.Mock).mockResolvedValue(null);
        const req = mockReq({ body: { mail: "x@y.com", password: "pass" } });
        const res = mockRes();
        await loginUser(req as any, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it("retourne 401 si le mot de passe est incorrect", async () => {
        (Users.findOne as jest.Mock).mockResolvedValue({ id_user: 1, password_hash: "hash" });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
        const req = mockReq({ body: { mail: "a@b.com", password: "wrong" } });
        const res = mockRes();
        await loginUser(req as any, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it("retourne 200 avec token si connexion réussie", async () => {
        (Users.findOne as jest.Mock).mockResolvedValue({ id_user: 5, password_hash: "hash" });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        const req = mockReq({ body: { mail: "a@b.com", password: "correct" } });
        const res = mockRes();
        await loginUser(req as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ token: "fake.jwt.token", user_id: 5 })
        );
    });
    it("retourne 500 en cas d'erreur serveur", async () => {
        (Users.findOne as jest.Mock).mockRejectedValue(new Error("db"));
        const res = mockRes();
        await loginUser(mockReq({ body: {} }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});