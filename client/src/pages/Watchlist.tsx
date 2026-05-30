import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

interface WatchlistItem {
    id_user: number;
    id_film: number;
    date_ajout: string;
    Film: {
        id_film: number;
        titre: string;
        img: string;
        date_de_sortie: string;
    };
}

export const Watchlist = () => {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [undoData, setUndoData] = useState<{
        item: WatchlistItem;
        timeoutId: number;
    } | null>(null);

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/users/${userId}/watchlist`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setWatchlist(data);
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                navigate("/login");
            } else {
                setError("Erreur lors de la récupération de la watchlist.");
            }
        } catch (err) {
            setError("Impossible de se connecter au serveur.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFilm = (filmId: number) => {
        const itemToRemove = watchlist.find(
            item => item.id_film === filmId
        );

        if (!itemToRemove) return;

        // supprime direct de l'interface
        setWatchlist(prev =>
            prev.filter(item => item.id_film !== filmId)
        );

        // si déjà un undo en cours, on le valide (on évite conflits)
        if (undoData) {
            clearTimeout(undoData.timeoutId);
        }

        const timeoutId = window.setTimeout(async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");

            try {
                const response = await fetch(
                    `${API_URL}/users/${userId}/watchlist/${filmId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status !== 204) {
                    setWatchlist(prev => [...prev, itemToRemove]);
                    alert("Erreur lors de la suppression du film.");
                }
            } catch (err) {
                console.error(err);
                setWatchlist(prev => [...prev, itemToRemove]);
            }

            setUndoData(null);
        }, 5000);

        setUndoData({
            item: itemToRemove,
            timeoutId
        });
    };

    const undoRemove = () => {
        if (!undoData) return;

        clearTimeout(undoData.timeoutId);

        setWatchlist(prev => [...prev, undoData.item]);

        setUndoData(null);
    };

    if (loading)
        return (
            <div className="container mt-5 text-center">
                Chargement...
            </div>
        );

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Ma Watchlist</h2>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {watchlist.length === 0 && !error ? (
                <div className="alert alert-info">
                    Votre watchlist est vide pour le moment.
                </div>
            ) : (
                <div className="row">
                    {watchlist.map(item => (
                        <div
                            className="col-md-3 mb-4"
                            key={item.id_film}
                        >
                            <div className="card h-100 shadow-sm">
                                {item.Film.img ? (
                                    <img
                                        src={item.Film.img}
                                        className="card-img-top"
                                        alt={item.Film.titre}
                                        style={{
                                            height: "350px",
                                            objectFit: "cover"
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="card-img-top bg-secondary d-flex align-items-center justify-content-center"
                                        style={{ height: "350px" }}
                                    >
                                        <span className="text-white">
                                            Pas d'image
                                        </span>
                                    </div>
                                )}

                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">
                                        {item.Film.titre}
                                    </h5>

                                    <p className="card-text text-muted small">
                                        Sortie :{" "}
                                        {new Date(
                                            item.Film.date_de_sortie
                                        ).toLocaleDateString("fr-FR")}
                                    </p>

                                    <div className="mt-auto d-flex flex-column gap-2">
                                        <Link
                                            to={`/films/${item.id_film}`}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            Voir les détails
                                        </Link>

                                        <button
                                            onClick={() =>
                                                handleRemoveFilm(
                                                    item.id_film
                                                )
                                            }
                                            className="btn btn-outline-danger btn-sm"
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {undoData && (
                <div
                    className="toast show position-fixed bottom-0 end-0 m-4"
                    style={{
                        zIndex: 1050,
                        minWidth: "350px"
                    }}
                >
                    <div className="toast-body d-flex justify-content-between align-items-center">
                        <span>
                            « {undoData.item.Film.titre} » retiré de la watchlist
                        </span>

                        <button
                            className="btn btn-link btn-sm text-decoration-none"
                            onClick={undoRemove}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};