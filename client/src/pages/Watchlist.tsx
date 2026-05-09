import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

export const Watchlist = () => {
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ On utilise l'ID 1 pour tes tests actuels
    const userId = 1; 
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // ✅ URL CORRIGÉE : Correspond au router.get("/:user_id/watchlist")
        fetch(`${API_URL}/api/users/${userId}/watchlist`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Erreur ${res.status} : Impossible de récupérer la liste`);
                }
                return res.json();
            })
            .then(data => {
                setWatchlist(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [API_URL, userId]);

    // Fonction pour supprimer un film de la liste
    const handleRemove = (filmId: number) => {
        // ✅ URL CORRIGÉE : Correspond au router.delete("/:user_id/watchlist/:film_id")
        fetch(`${API_URL}/api/users/${userId}/watchlist/${filmId}`, {
            method: 'DELETE'
        }).then(res => {
            if (res.ok) {
                // Mise à jour locale pour éviter de recharger la page
                setWatchlist(watchlist.filter(item => item.id_film !== filmId));
            } else {
                alert("Erreur lors de la suppression");
            }
        }).catch(err => console.error("Erreur delete:", err));
    };

    if (isLoading) return <div className="container mt-4 text-center"><h4>Chargement de votre liste...</h4></div>;
    if (error) return <div className="container mt-4 text-danger text-center"><h4>Erreur : {error}</h4></div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Ma Liste à Voir 🍿</h1>
            
            <div className="row">
                {watchlist.length > 0 ? (
                    watchlist.map((item) => (
                        <div className="col-md-3 mb-4" key={`${item.id_user}-${item.id_film}`}>
                            <div className="card h-100 shadow-sm border-0">
                                {/* ✅ On accède aux infos via item.Film à cause du "include" Sequelize */}
                                <img 
                                    src={item.Film?.img || "https://via.placeholder.com/300x450?text=Pas+d'image"} 
                                    className="card-img-top" 
                                    alt={item.Film?.titre} 
                                    style={{ height: '350px', objectFit: 'cover' }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold">{item.Film?.titre || "Titre inconnu"}</h5>
                                    <p className="card-text text-muted small mt-auto">
                                        Ajouté le : {new Date(item.date_ajout).toLocaleDateString()}
                                    </p>
                                    <div className="d-flex justify-content-between gap-2 mt-2">
                                        <Link to={`/films/${item.id_film}`} className="btn btn-sm btn-primary flex-grow-1">
                                            Détails
                                        </Link>
                                        <button 
                                            onClick={() => handleRemove(item.id_film)}
                                            className="btn btn-sm btn-outline-danger"
                                            title="Retirer de la liste"
                                        >
                                            Effacer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted fs-5">Votre watchlist est vide.</p>
                        <Link to="/films" className="btn btn-primary">Parcourir les films</Link>
                    </div>
                )}
            </div>
        </div>
    );
};