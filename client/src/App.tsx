import { useEffect, useState } from "react";
// Définition d'une interface pour le typage
// Sera couvert plus en profondeur en TH
interface User {
    id: number;
    nom: string;
    prenom: string;
}

function App() {
    // 1. Définition de l'état
    const [data, setData] = useState<User[]>([]);

    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    // 2. Appel API au montage du composant
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users`)
            .then(res => res.json())
            .then(result => setData(result))
            .catch(err => console.error(err));
    }, []);

    async function soumission_form(){
        await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, prenom })
        });

        const req = await fetch(`${import.meta.env.VITE_API_URL}/users`);
        const users = await req.json();

        setData(users);

        setNom("");
        setPrenom("");
    }

    async function delete_user(id: number){
        await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
            method : "DELETE",
        });

        setData(prev => prev.filter(user => user.id != id));
    }

    // 3. Rendu (JSX)
    return (
        <div className="bg-light min-vh-100">

            <div className="container mt-5">

            <h1 className="text-center mb-4">Test gestion des utilisateurs</h1>
                <div>
                    <div className="card mb-4">
                        <div className="card-header">
                            Liste des utilisateurs
                        </div>
                        <ul id="userList" className="list-group list-group-flush">
                            {data.map((item) => (
                                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {item.nom} {item.prenom}<button className='btn btn-secondary btn-sm' onClick={() => delete_user(item.id)}>X</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card p-4 shadow-sm">
                        <form id="userForm">

                            <div className="mb-3">
                                <label htmlFor="nom" className="form-label">Nom</label>
                                <input type="text" className="form-control" name="nom" id="nom" value={nom} onChange={(e) => {setNom(e.target.value)}} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="prenom" className="form-label">Prénom</label>
                                <input type="text" className="form-control" name="prenom" id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
                            </div>

                            <button type="button" onClick={() => soumission_form()} className="btn btn-primary w-100">
                                Ajouter
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;