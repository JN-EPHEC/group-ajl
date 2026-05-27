/**
 Tests unitaires — middlewares/
 - authMiddleware.ts (verifyToken)
 - checkIdParam.ts (checkIdParam)
 - errorHandler.ts (errorHandler)
 - logger.ts (requestLogger)
 Stratégie : mock des objets Request / Response / NextFunction d'Express,
 mock de jsonwebtoken pour tester les branches JWT.

 */

import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/authMiddleware";
import { checkIdParam } from "../middlewares/checkIdParam";
import { errorHandler } from "../middlewares/errorHandler";
import { requestLogger } from "../middlewares/logger";

//Aide : faux objets Express
const mockRequest = (overrides: object = {}) => ({
    headers: {},
    params: {},
    method: "GET",
    url: "/test",
    ...overrides,
});

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();
beforeEach(() => {
    jest.clearAllMocks();
});

// authMiddleware — verifyToken
describe("verifyToken", () => {
    it("retourne 403 si aucun header Authorization", () => {
        const req = mockRequest({ headers: {} }) as any;
        const res = mockResponse();
        verifyToken(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Token requis" });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("retourne 403 si header Authorization sans 'Bearer'", () => {
        const req = mockRequest({ headers: { authorization: "Basic abc" } }) as any;
        const res = mockResponse();
        verifyToken(req, res, mockNext);
        // split(' ')[1] retourne 'abc' mais si le format est autre -> token peut être défini
        // Ici 'Basic abc'.split(' ')[1] = 'abc' -> on va dans jwt.verify
        // jwt va lever une erreur -> 401
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Token invalide" });
    });
    it("retourne 401 si token invalide / expiré", () => {
        const req = mockRequest({
            headers: { authorization: "Bearer tokeninvalide" },
        }) as any;
        const res = mockResponse();
        verifyToken(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Token invalide" });
        expect(mockNext).not.toHaveBeenCalled();
    });
    it("appelle next() si token valide et attache req.user", () => {
        const secret = "MON_SECRET_JWT";
        const token = jwt.sign({ id_user: 42 }, secret, { expiresIn: "1h" });
        const req = mockRequest({
            headers: { authorization: `Bearer ${token}` },
        }) as any;
        const res = mockResponse();
        verifyToken(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(req.user).toBeDefined();
        expect((req.user as any).id_user).toBe(42);
    });
});

// checkIdParam
describe("checkIdParam", () => {
    it("retourne 400 si un paramètre n'est pas numérique", () => {
        const req = mockRequest({ params: { id: "abc" } }) as any;
        const res = mockResponse();
        checkIdParam(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Le paramètre id doit être numérique",
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
    it("appelle next() si tous les paramètres sont numériques", () => {
        const req = mockRequest({ params: { id: "42" } }) as any;
        const res = mockResponse();
        checkIdParam(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
    it("appelle next() quand il n'y a aucun paramètre", () => {
        const req = mockRequest({ params: {} }) as any;
        const res = mockResponse();
        checkIdParam(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
    it("retourne 400 sur le premier paramètre invalide parmi plusieurs", () => {
        const req = mockRequest({ params: { id: "123", nom: "toto" } }) as any;
        const res = mockResponse();
        checkIdParam(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("appelle next() si plusieurs paramètres tous numériques", () => {
        const req = mockRequest({ params: { id: "1", other: "99" } }) as any;
        const res = mockResponse();
        checkIdParam(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});
// errorHandler
describe("errorHandler", () => {
    it("répond avec le status et le message de l'erreur", () => {
        const err = { status: 422, message: "Données invalides" };
        const req = mockRequest() as any;
        const res = mockResponse();
        errorHandler(err, req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ msg: "Données invalides" });
    });
    it("utilise 500 et 'Erreur serveur' par défaut si err n'a pas de status/message", () => {
        const err = {};
        const req = mockRequest() as any;
        const res = mockResponse();
        errorHandler(err, req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erreur serveur" });
    });
    it("loggue l'erreur en console", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const err = new Error("boom");
        errorHandler(err, mockRequest() as any, mockResponse(), mockNext);
        expect(consoleSpy).toHaveBeenCalledWith(err);
        consoleSpy.mockRestore();
    });
});

// requestLogger
describe("requestLogger", () => {
    it("loggue la requête si NODE_ENV != 'production'", () => {
        const original = process.env.NODE_ENV;
        process.env.NODE_ENV = "development";
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        const req = mockRequest({ method: "GET", url: "/films" }) as any;
        requestLogger(req, mockResponse(), mockNext);
        expect(consoleSpy).toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalled();
        consoleSpy.mockRestore();
        process.env.NODE_ENV = original;
    });
    it("ne loggue PAS en production", () => {
        const original = process.env.NODE_ENV;
        process.env.NODE_ENV = "production";
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        const req = mockRequest({ method: "POST", url: "/users" }) as any;
        requestLogger(req, mockResponse(), mockNext);
        expect(consoleSpy).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalled();
        consoleSpy.mockRestore();
        process.env.NODE_ENV = original;
    });
});