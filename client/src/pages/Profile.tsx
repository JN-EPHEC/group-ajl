import { useState, useEffect } from 'react';
import { Watchlist } from './Watchlist';
import '../index.css';

export const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [notes, setNotes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const API_URL = import.meta.env.VITE_API_URL;
    const userId = 1;

    useEffect(() => {
        // Chargement simultané des infos et des notes
        const fetchUser = fetch(`${API_URL}/api/users/${userId}`).then(res => res.json());
        
        const fetchNotes = fetch(`${API_URL}/api/users-notes/user/${userId}`).then(res => res.json());

        Promise.all([fetchUser, fetchNotes])
            .then(([userData, notesData]) => {
                setUser(userData);
                setNotes(Array.isArray(notesData) ? notesData : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Erreur Profil:", err);
                setIsLoading(false);
            });
    }, [API_URL]);

    if (isLoading) return <div className="container mt-5 text-center text-white"><h3>Chargement du profil...</h3></div>;

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
                        <p className="text-muted small">{user?.mail}</p>
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
                                            {n.note}/5
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
                    <div className="card shadow-sm border-0 p-4">
                        <h2 className="mb-4">Ma Watchlist</h2>
                        <Watchlist />
                    </div>
                </div>
            </div>
        </div>
    );
};