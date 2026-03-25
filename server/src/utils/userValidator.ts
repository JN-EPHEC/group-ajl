export function userValidator(age: number, role: string, email: string){
    if(!/@/.test(email) || !/\./.test(email)){
        return false;
    };

    if(age < 18){

        if(role !== "stagiaire"){
            return false;
        }
    }
    
    if(age >= 18 && age <= 120){

        if(role !== "stagiaire" && role !== "admin" && role !== "user"){
            throw new Error("Rôle invalide")
        }else{
            return true;
        }
    }

    if(age > 120){
        throw new Error("Âge invalide");
    }

    return true;
};