async function init(){
    const donnees = await fetch("http://localhost:3000/api/users");
    const utilisateurs = await donnees.json();
}

async function soumission_form() {
    const titre = document.getElementById("titre").value;
    const dateDeSortie = document.getElementById("dateDeSortie").value;
    const realisateur = document.getElementById("realisateur").value;
    const duree = document.getElementById("duree").value;
    const genres = document.getElementById("genres").value;
    const acteurs = document.getElementById("acteurs").value;
    const moyenne = document.getElementById("moyenne").value;

    await fetch("http://localhost:3000/api/films", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titre: titre,
            dateDeSortie: dateDeSortie,
            realisateur: realisateur,
            duree: Number(duree),
            genres: genres,
            acteurs: acteurs,
            moyenne: Number(moyenne)
        })
    });

    init();
}

async function recupUtilisateur(){
    const pseudo = document.getElementById("pseudonyme").value;
    const mail = document.getElementById("mail").value;

    await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pseudonyme: pseudo,
            mail: mail,
        })
    });

    init();
}

async function delete_user(id){
    await fetch(`http://localhost:3000/api/users/${id}`, {
        method : "DELETE",
    });

    init();
}