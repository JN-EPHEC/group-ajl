/**
 * Tests unitaires — user_noteControllers.ts
 * Fonctions couvertes :
 *   getAllUser_note — succès (200) + erreur (500)
 *   createUser_note — user 404 + film 404 + succès (201) + erreur (500)
 *   deleteUser_note — supprimée (204) + non trouvée (404) + erreur (500)
 *   getNotesByUserId — succès (200) + erreur (500)
 *   getUserNoteForFilm — trouvée (200) + non trouvée (200 null) + erreur (500)
 *   updateUser_note — succès (200) + non trouvée (404) + erreur (500)
 *   getNotesForFilm — succès (200) + erreur (500)
 */
import UserNote from "../models/Users_notes";
import User     from "../models/Users";
import Film     from "../models/Films";
import {
    getAllUser_note,
    createUser_note,
    deleteUser_note,
    getNotesByUserId,
    getUserNoteForFilm,
    updateUser_note,
    getNotesForFilm,
} from "../controllers/user_noteControllers";

// Aides
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
jest.mock("../models/Users_notes", () => ({
    __esModule: true,
    default: {
        findAll:  jest.fn(),
        findOne:  jest.fn(),
        create:   jest.fn(),
        destroy:  jest.fn(),
        update:   jest.fn(),
    },
}));
jest.mock("../models/Users", () => ({
    __esModule: true,
    default: { findByPk: jest.fn() },
}));

jest.mock("../models/Films", () => ({
    __esModule: true,
    default: { findByPk: jest.fn() },
}));

// getAllUser_note
describe("getAllUser_note", () => {
    it("retourne 200 avec toutes les notes", async () => {
        (UserNote.findAll as jest.Mock).mockResolvedValue([{ id_user: 1, id_film: 2, note: 4 }]);
        const res = mockRes();
        await getAllUser_note(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (UserNote.findAll as jest.Mock).mockRejectedValue(new Error("db"));
        const res = mockRes();
        await getAllUser_note(mockReq() as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// createUser_note
describe("createUser_note", () => {
    it("retourne 404 si l'utilisateur n'existe pas", async () => {
        (User.findByPk as jest.Mock).mockResolvedValue(null);
        const res = mockRes();
        await createUser_note(
            mockReq({ body: { id_user: 99, id_film: 1, note: 5 } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Utilisateur introuvable" });
    });
    it("retourne 404 si le film n'existe pas", async () => {
        (User.findByPk as jest.Mock).mockResolvedValue({ id_user: 1 });
        (Film.findByPk as jest.Mock).mockResolvedValue(null);
        const res = mockRes();
        await createUser_note(
            mockReq({ body: { id_user: 1, id_film: 99, note: 5 } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Film introuvable" });
    });
    it("retourne 201 avec la note créée", async () => {
        (User.findByPk as jest.Mock).mockResolvedValue({ id_user: 1 });
        (Film.findByPk as jest.Mock).mockResolvedValue({ id_film: 2 });
        const note = { id_user: 1, id_film: 2, note: 4, commentaire: "Super" };
        (UserNote.create as jest.Mock).mockResolvedValue(note);
        const res = mockRes();
        await createUser_note(
            mockReq({ body: { id_user: 1, id_film: 2, note: 4, commentaire: "Super" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(note);
    });
    it("retourne 500 en cas d'erreur serveur", async () => {
        (User.findByPk as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await createUser_note(mockReq({ body: {} }) as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// deleteUser_note
describe("deleteUser_note", () => {
    it("retourne 204 si la note est supprimée", async () => {
        (UserNote.destroy as jest.Mock).mockResolvedValue(1);
        const res = mockRes();
        await deleteUser_note(
            mockReq({ params: { user_id: "1", film_id: "2" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(204);
    });
    it("retourne 404 si la note n'existe pas", async () => {
        (UserNote.destroy as jest.Mock).mockResolvedValue(0);
        const res = mockRes();
        await deleteUser_note(
            mockReq({ params: { user_id: "1", film_id: "99" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Note introuvable" });
    });
    it("retourne 500 en cas d'erreur", async () => {
        (UserNote.destroy as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await deleteUser_note(
            mockReq({ params: { user_id: "1", film_id: "1" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// getNotesByUserId

describe("getNotesByUserId", () => {
    it("retourne 200 avec les notes de l'utilisateur", async () => {
        (UserNote.findAll as jest.Mock).mockResolvedValue([{ id_film: 2, note: 3 }]);
        const res = mockRes();
        await getNotesByUserId(
            mockReq({ params: { user_id: "1" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (UserNote.findAll as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await getNotesByUserId(
            mockReq({ params: { user_id: "1" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// getUserNoteForFilm
describe("getUserNoteForFilm", () => {
    it("retourne 200 avec la note si elle existe", async () => {
        const note = { id_user: 1, id_film: 2, note: 5 };
        (UserNote.findOne as jest.Mock).mockResolvedValue(note);
        const res = mockRes();
        await getUserNoteForFilm(
            mockReq({ params: { user_id: "1", film_id: "2" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(note);
    });
    it("retourne 200 avec null si aucune note", async () => {
        (UserNote.findOne as jest.Mock).mockResolvedValue(null);
        const res = mockRes();
        await getUserNoteForFilm(
            mockReq({ params: { user_id: "1", film_id: "99" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(null);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (UserNote.findOne as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await getUserNoteForFilm(
            mockReq({ params: { user_id: "1", film_id: "1" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// updateUser_note
describe("updateUser_note", () => {
    it("retourne 200 avec la note mise à jour", async () => {
        (UserNote.update as jest.Mock).mockResolvedValue([1]);
        const updated = { id_user: 1, id_film: 2, note: 5, commentaire: "Excellent" };
        (UserNote.findOne as jest.Mock).mockResolvedValue(updated);
        const res = mockRes();
        await updateUser_note(
            mockReq({ params: { user_id: "1", film_id: "2" }, body: { note: 5, commentaire: "Excellent" } }) as any,
            res
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updated);
    });
    it("retourne 404 si aucune note modifiée", async () => {
        (UserNote.update as jest.Mock).mockResolvedValue([0]);
        const res = mockRes();
        await updateUser_note(
            mockReq({ params: { user_id: "1", film_id: "99" }, body: { note: 3 } }) as any,
            res
        );
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: "Note introuvable ou aucune modification effectuée",
        });
    });
    it("retourne 500 en cas d'erreur", async () => {
        (UserNote.update as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await updateUser_note(
            mockReq({ params: { user_id: "1", film_id: "1" }, body: {} }) as any,
            res
        );
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// getNotesForFilm

describe("getNotesForFilm", () => {
    it("retourne 200 avec tous les avis du film", async () => {
        (UserNote.findAll as jest.Mock).mockResolvedValue([{ id_user: 1, note: 4 }]);
        const res = mockRes();
        await getNotesForFilm(
            mockReq({ params: { film_id: "2" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("retourne 500 en cas d'erreur", async () => {
        (UserNote.findAll as jest.Mock).mockRejectedValue(new Error("err"));
        const res = mockRes();
        await getNotesForFilm(
            mockReq({ params: { film_id: "2" } }) as any, res
        );
        expect(res.status).toHaveBeenCalledWith(500);
    });
});