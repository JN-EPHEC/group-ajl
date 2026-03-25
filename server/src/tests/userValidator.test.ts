import { userValidator } from "../utils/userValidator";

describe("userValidator function", () => {

    const users:{age: number; role: "admin" | "stagiaire" | "user"; email:string, expected:boolean}[] = [
        {age: 16, role: "admin", email: "test@gmail.com", expected:false},
        {age: 16, role: "stagiaire", email: "test@gmailcom", expected:false},
        {age: 16, role: "stagiaire", email: "test@gmail.com", expected:true},
        {age: 19, role: "user", email: "test@gmail.com", expected:true},
        {age: 19, role: "stagiaire", email: "test@gmail.com", expected:true},
        {age: 19, role: "admin", email: "test@gmail.com", expected:true},
        {age: 19, role: "admin", email: "testgmail.com", expected:false},
        {age: 19, role: "user", email: "testgmail.com", expected:false},
        {age: 19, role: "stagiaire", email: "test@gmail.com", expected:true} 
    ]

    test.each(users)(
        "userValidator($age, $role, $email) should return $expected",
            ({ age, role, email, expected }) => {
                expect(userValidator(age, role, email)).toBe(expected);
            }
    );

    it("Devrait lever erreur si age > 120", () => {
        expect(() => userValidator(130,"admin","test@gmail.com")).toThrow(Error);
    });

    it("Devrait lever erreur si role != admin && role && user && role != stagiaire", () => {
        expect(() => userValidator(25,"test","test@gmail.com")).toThrow(Error);
    });
})