import { validatePassword } from "../utils/password";

describe("Password Validator - White Box Testing", () => {
// Test initial pour initialiser le rapport de couverture
    
    // Ce test ne couvre que la première ligne de la fonction (Branch 1)
    it("devrait rejeter un mot de passe vide", () => {
        const result = validatePassword("", 25);
        expect(result).toBe(false);
    });

    //Branch 2
    it("Devrait rejeter mot de passe de moins de 8 caractères", () => {
        const result = validatePassword("test", 15);
        expect(result).toBe(false);
    });

    //Branch 3
    it("Devrait rejeter mot de passe de plus de 20 caractères", () => {
        const result = validatePassword("nonzbennieosnfdnonnbfdd", 15);
        expect(result).toBe(false);
    });

    //Branch 4
    it("Devrait rejeter mot de passe qui ne contient pas de lowercase si age < 12", () => {
        const result = validatePassword("TESLKNSBND", 10);
        expect(result).toBe(false);
    });

    it("Devrait accepter mot de passe valide si age < 12", () => {
        const result = validatePassword("Abcdefg8[F", 10);
        expect(result).toBe(true);
    })

    //Branch 5
    it("Devrait rejeter mot de passe qui ne contient pas de uppercase, de lowercase ou de nombre si 12 <= age <= 65", () => {
        const result = validatePassword("[[[[[[[[[", 25);
        expect(result).toBe(false);
        const result2 = validatePassword("hbohdfxo", 25);
        expect(result2).toBe(false);
        const result3 = validatePassword("51524512", 25);
        expect(result3).toBe(false);
    });

    //Branch 6
    it("Devrait rejeter mot de passe qui ne contient pas de specials si 12 <= age <= 65", () => {      
        const result = validatePassword("iosev8oOhvs", 15);
        expect(result).toBe(false);
    });

    //Branch 7
    it("Devrait rejeter mot de passe si ne contient pas de nombre et d'uppercase si age > 65", () => {
        const result = validatePassword("kjvsonvs],", 75);
        expect(result).toBe(false);
    });

    //Branch finale
    it("Devrait accepter le mot de passe", () => {
        const result = validatePassword("knVs8sb[ik,k", 25);
        expect(result).toBe(true);
        const result2 = validatePassword("Elnvrdn8,[", 75);
        expect(result2).toBe(true);
    });
});
