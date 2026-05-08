import { useState, useEffect } from 'react';
import '../index.css'; 

export const RatedMovies = () => {
    // État pour stocker les notes provenant de la DB
    const [ratedMovies, setRatedMovies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Récupération de l'URL de l'API (ex: http://localhost:3000/api)
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Appel à la route GET /api/user-note définie dans votre backend
        fetch(`${API_URL}/user-note`)
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

    if (isLoading) return <div className="container mt-4 text-center">Chargement de vos avis...</div>;
    if (error) return <div className="container mt-4 text-danger text-center">Erreur : {error}</div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Mes Films Notés</h1>
            <div className="list-group shadow-sm">
                {ratedMovies.length > 0 ? (
                    ratedMovies.map((item) => (
                        // La clé est composée de l'ID utilisateur et du film (clé primaire composite)
                        <div className="list-group-item list-group-item-action p-4" key={`${item.user_id}-${item.film_id}`}>
                            <div className="d-flex w-100 justify-content-between">
                                {/* Accès au titre via l'include Film du backend */}
                                <h5 className="mb-1">{item.Film?.titre || `Film #${item.film_id}`}</h5>
                               <small className="text-warning fs-5">
                                    {/* On s'assure que la note est entre 0 et 5 pour éviter les nombres négatifs */}
                                    {'★'.repeat(Math.min(5, Math.max(0, item.note)))}
                                    {'☆'.repeat(Math.max(0, 5 - item.note))}
                                </small>
                            </div>
                            {/* Commentaire de l'utilisateur */}
                            <p className="mb-1 text-muted italic">"{item.commentaire}"</p>
                            <small className="text-muted">Utilisateur ID: {item.user_id}</small>
                        </div>
                    ))
                ) : (
                    <div className="list-group-item text-center py-5 text-muted">
                        Vous n'avez pas encore noté de films.
                    </div>
                )}
            </div>
        </div>
    );
};