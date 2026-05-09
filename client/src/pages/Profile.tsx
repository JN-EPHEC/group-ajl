import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Watchlist } from './Watchlist';
import '../index.css';

export const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [notes, setNotes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Hook pour rediriger vers le login si besoin
    const navigate = useNavigate();
    
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    useEffect(() => {
        // 1. Récupération de l'ID dynamique et du token depuis le stockage du navigateur
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        // Redirection de sécurité si l'utilisateur n'est pas connecté
        if (!token || !userId) {
            navigate("/login");
            return;
        }

        // Configuration du header avec le badge d'accès (token)
        const fetchOptions = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };

        // 2. Chargement simultané des infos et des notes avec les options sécurisées
        const fetchUser = fetch(`${API_URL}/api/users/${userId}`, fetchOptions)
            .then(res => {
                if (!res.ok) throw new Error("Erreur d'authentification ou profil introuvable");
                return res.json();
            });
        
        const fetchNotes = fetch(`${API_URL}/api/users-notes/user/${userId}`, fetchOptions)
            .then(res => res.json());

        Promise.all([fetchUser, fetchNotes])
            .then(([userData, notesData]) => {
                setUser(userData);
                setNotes(Array.isArray(notesData) ? notesData : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Erreur Profil:", err);
                // Si la requête échoue (ex: token expiré), on nettoie et on redirige
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                navigate("/login");
            });
    }, [API_URL, navigate]);

    // Fonction pratique pour se déconnecter manuellement
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    if (isLoading) return <div className="container mt-5 text-center"><h3>Chargement du profil...</h3></div>;

    return (
        <div className="container mt-4">
            <div className="row">
                {/* --- GAUCHE : INFOS & NOTES --- */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 mb-4 text-center p-4">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow" 
                             style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                            {user?.pseudonyme?.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="fw-bold mb-1 text-dark">{user?.pseudonyme}</h3>
                        <p className="text-muted small mb-3">{user?.mail}</p>
                        
                        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100">
                            Se déconnecter
                        </button>
                    </div>

                    {/* SECTION NOTES ⭐ */}
                    <div className="card shadow-sm border-0 p-3 bg-light">
                        <h5 className="fw-bold mb-3">⭐ Mes Avis</h5>
                        {notes.length > 0 ? (
                            <div className="list-group list-group-flush rounded">
                                {notes.map((n: any) => (
                                    <div key={`${n.id_user}-${n.id_film}`} className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-1 border-bottom">
                                        <div className="text-truncate" style={{ maxWidth: '160px' }}>
                                            <span className="fw-bold small">{n.Film?.titre}</span>
                                        </div>
                                        <span className="badge bg-warning text-dark">
                                            {n.note}/10
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted small text-center my-3">Vous n'avez pas encore noté de film.</p>
                        )}
                    </div>
                </div>

                {/* --- DROITE : WATCHLIST --- */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 p-4 h-100">
                        {/* J'ai retiré le titre "Ma Watchlist" car le composant Watchlist.tsx génère déjà le sien ! */}
                        <Watchlist />
                    </div>
                </div>
            </div>
        </div>
    );
};