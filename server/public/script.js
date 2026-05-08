const API_URL = "http://localhost:3000/api";

// --- FONCTION FILMS ---
async function soumission_form() {
    const data = {
        titre: document.getElementById("titre").value,
        dateDeSortie: document.getElementById("dateDeSortie").value,
        realisateur_id: Number(document.getElementById("realisateur_id").value),
        duree_minute: Number(document.getElementById("duree_minute").value),
        synopsis: document.getElementById("synopsis").value,
        img: document.getElementById("img").value
    };

    try {
        const response = await fetch(`${API_URL}/films`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (response.ok) alert("✅ Film créé !");
        else alert("❌ Erreur lors de la création du film.");
    } catch (err) { console.error(err); }
}

// --- FONCTION UTILISATEURS ---
async function ajouterUser() {
    const data = {
        pseudonyme: document.getElementById("pseudo").value,
        mail: document.getElementById("mail").value,
        motdepasse: "password123"
    };

    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (response.ok) alert("✅ Utilisateur créé !");
}

// --- FONCTION WATCHLIST (CORRIGÉE) ---
async function ajouterAWatchlist() {
    const user_id = document.getElementById("watch_user_id").value;
    const film_id = document.getElementById("watch_film_id").value;

    if (!user_id || !film_id) {
        alert("ID User et ID Film requis !");
        return;
    }

    // On injecte l'user_id dans l'URL pour correspondre à /:user_id/watchlist
    const response = await fetch(`${API_URL}/users/${user_id}/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            user_id: Number(user_id), 
            film_id: Number(film_id) 
        })
    });

    if (response.ok) alert("✅ Ajouté à la watchlist !");
    else alert("❌ Erreur (Vérifie si l'ID User et l'ID Film existent en DB)");
}

// --- FONCTION NOTES ---
async function ajouterNote() {
    const data = {
        user_id: Number(document.getElementById("note_user_id").value),
        film_id: Number(document.getElementById("note_film_id").value),
        note: Number(document.getElementById("note_valeur").value),
        commentaire: document.getElementById("note_comm").value
    };

    const response = await fetch(`${API_URL}/user-note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (response.ok) alert("✅ Note enregistrée !");
}

// --- FONCTIONS LIAISONS ---
async function lierGenre() {
    const data = {
        film_id: Number(document.getElementById("genre_film_id").value),
        genre_id: Number(document.getElementById("genre_id").value)
    };

    const response = await fetch(`${API_URL}/genres-films`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (response.ok) alert("✅ Genre associé !");
}

async function lierActeur() {
    const data = {
        film_id: Number(document.getElementById("act_film_id").value),
        acteur_id: Number(document.getElementById("act_id").value),
        role: document.getElementById("act_role").value
    };

    const response = await fetch(`${API_URL}/acteurs-films`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (response.ok) alert("✅ Acteur associé !");
}

// --- FONCTION RÉALISATEURS ---
async function ajouterRealisateur() {
    const data = {
        nom: document.getElementById("real_nom").value,
        prenom: document.getElementById("real_prenom").value
    };

    if (!data.nom || !data.prenom) {
        alert("Nom et Prénom requis !");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/reals`, { // Vérifie si ta route est bien /reals
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Réalisateur créé :", result);
            alert(`✅ Réalisateur créé ! Note son ID pour créer le film.`);
        } else {
            alert("❌ Erreur lors de la création du réalisateur.");
        }
    } catch (err) {
        console.error("Erreur Fetch Réalisateur:", err);
    }
}
// --- AJOUTER UN ACTEUR ---
async function ajouterActeur() {
    const data = {
        nom: document.getElementById("acteur_nom").value,
        prenom: document.getElementById("acteur_prenom").value
    };

    if (!data.nom || !data.prenom) return alert("Nom et Prénom requis !");

    try {
        const response = await fetch(`${API_URL}/acteurs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert(`✅ Acteur créé ! (ID: ${result.acteur_id})`);
        } else {
            alert("❌ Erreur lors de la création de l'acteur.");
        }
    } catch (err) {
        console.error("Erreur Acteur:", err);
    }
}

// --- AJOUTER UN GENRE ---
async function ajouterGenre() {
    const nom = document.getElementById("genre_nom").value;

    if (!nom) return alert("Le nom du genre est requis !");

    try {
        const response = await fetch(`${API_URL}/genres`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom })
        });

        if (response.ok) {
            const result = await response.json();
            alert(`✅ Genre créé ! (ID: ${result.genre_id})`);
        } else {
            alert("❌ Erreur lors de la création du genre.");
        }
    } catch (err) {
        console.error("Erreur Genre:", err);
    }
}

window.onload = () => console.log("Interface de test prête.");
