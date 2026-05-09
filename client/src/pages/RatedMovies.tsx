import { useState, useEffect } from 'react';
import '../index.css'; 

export const RatedMovies = () => {
    const [ratedMovies, setRatedMovies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        
        fetch(`${API_URL}/api/users-notes`)
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la récupération des notes");
                return res.json();
            })
            .then(data => {
                setRatedMovies(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [API_URL]);

    if (isLoading) return <div className="container mt-4 text-center"><h4>Chargement de vos avis...</h4></div>;
    if (error) return <div className="container mt-4 text-danger text-center"><h4>Erreur : {error}</h4></div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Derniers Avis des Utilisateurs</h1>
            <div className="list-group shadow-sm">
                {ratedMovies.length > 0 ? (
                    ratedMovies.map((item) => (
                        <div className="list-group-item list-group-item-action p-4" key={`${item.id_user}-${item.id_film}`}>
                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <h5 className="mb-1 fw-bold">
                                    {/* On affiche le titre du film (via l'include) et le pseudo (si inclus) */}
                                    {item.Film?.titre || `Film #${item.id_film}`} 
                                    {item.User && <span className="text-muted fw-normal fs-6"> — par {item.User.pseudonyme}</span>}
                                </h5>
                                
                                <div className="text-warning fs-5">
                                    {/* CORRECTION : Affichage sur 10 étoiles */}
                                    <span className="me-2 text-dark fw-bold">{item.note}/10</span>
                                    {'★'.repeat(Math.floor(item.note))}
                                    {'☆'.repeat(10 - Math.floor(item.note))}
                                </div>
                            </div>

                            <p className="mb-2 text-muted fst-italic">"{item.commentaire || "Pas de commentaire."}"</p>
                            
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">ID Utilisateur : {item.id_user}</small>
                                {/* Optionnel : Lien vers le film */}
                                <a href={`/films/${item.id_film}`} className="btn btn-sm btn-link">Voir le film</a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="list-group-item text-center py-5 text-muted">
                        Aucun avis n'a été publié pour le moment.
                    </div>
                )}
            </div>
        </div>
    );
};