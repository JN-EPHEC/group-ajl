import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Watchlist = () => {
    // État pour stocker la liste des films à voir
    const [myList, setMyList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Récupération de l'URL de l'API depuis les variables d'environnement
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Pour l'instant, on récupère la liste de l'utilisateur ID 1
        fetch(`${API_URL}/users/1/watchlist`)
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la récupération de la liste");
                return res.json();
            })
            .then(data => {
                setMyList(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [API_URL]);

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container mt-5 alert alert-danger">Erreur : {error}</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4 fw-bold">Ma Liste à Voir 🍿</h1>

            {myList.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                    {myList.map((item) => (
                        <div className="col" key={item.film_id}>
                            <div className="card h-100 shadow-sm border-0 movie-card-hover">
                                {/* On accède aux infos via item.Film car c'est une table de liaison */}
                                <img 
                                    src={item.Film?.img || "https://via.placeholder.com/300x450?text=Pas+d'image"} 
                                    className="card-img-top" 
                                    alt={item.Film?.titre} 
                                    style={{ height: '350px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title text-truncate fw-bold">
                                        {item.Film?.titre || "Titre inconnu"}
                                    </h5>
                                    <p className="card-text text-muted small">
                                        Ajouté le : {item.date_ajout ? new Date(item.date_ajout).toLocaleDateString() : "Date inconnue"}
                                    </p>
                                    <Link to={`/films/${item.film_id}`} className="btn btn-primary w-100 mt-2">
                                        Voir la fiche
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5 bg-light rounded border">
                    <h3 className="text-muted">Ta watchlist est vide</h3>
                    <p>Parcoure le catalogue pour ajouter des films que tu souhaites voir plus tard.</p>
                    <Link to="/films" className="btn btn-outline-primary mt-3">
                        Explorer les films
                    </Link>
                </div>
            )}
        </div>
    );
};