import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../index.css';

export const MovieDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [film, setFilm] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: string, msg: string } | null>(null);

    const API_URL = import.meta.env.VITE_API_URL;
    const userId = 1;

    useEffect(() => {
        fetch(`${API_URL}/api/films/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Film introuvable");
                return res.json();
            })
            .then(data => {
                setFilm(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [id, API_URL]);

    const handleAddToWatchlist = async () => {
        setIsAdding(true);
        setFeedback(null);
        try {
            const response = await fetch(`${API_URL}/api/users/${userId}/watchlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_film: parseInt(id || '0') })
            });
            if (response.ok) {
                setFeedback({ type: 'success', msg: 'Ajouté à votre liste ! 🍿' });
            } else {
                setFeedback({ type: 'warning', msg: 'Déjà dans votre liste.' });
            }
        } catch (err) {
            setFeedback({ type: 'danger', msg: 'Erreur lors de l\'ajout.' });
        } finally {
            setIsAdding(false);
        }
    };

    if (isLoading) return <div className="container mt-5 text-center"><h3>Chargement...</h3></div>;
    if (error || !film) return <div className="container mt-5 text-center text-danger"><h3>{error}</h3></div>;

    // ✅ On formate la moyenne récupérée du backend (qui arrive souvent en string)
    const displayNote = film.moyenne ? parseFloat(film.moyenne).toFixed(1) : null;

    return (
        <div className="container mt-5">
            <Link to="/films" className="btn btn-outline-secondary mb-4">← Retour</Link>

            <div className="row">
                {/* Colonne Affiche */}
                <div className="col-md-4 mb-4">
                    <img src={film.img} alt={film.titre} className="img-fluid rounded shadow-lg w-100" />
                    <div className="mt-4">
                        <button 
                            onClick={handleAddToWatchlist}
                            disabled={isAdding}
                            className={`btn btn-lg w-100 ${feedback?.type === 'success' ? 'btn-success' : 'btn-primary'}`}
                        >
                            {isAdding ? 'Ajout...' : '➕ Ma Watchlist'}
                        </button>
                        {feedback && <div className={`alert alert-${feedback.type} mt-2 py-2 small text-center`}>{feedback.msg}</div>}
                    </div>
                </div>

                {/* Colonne Infos */}
                <div className="col-md-8 px-4">
                    <h1 className="display-4 fw-bold">{film.titre}</h1>
                    
                    <div className="d-flex align-items-center gap-3 my-3">
                        {/* ✅ AFFICHAGE DE LA NOTE RÉCUPÉRÉE DU BACKEND */}
                        {displayNote ? (
                            <span className="badge bg-warning text-dark fs-5 shadow-sm">
                                ⭐ {displayNote} / 5
                            </span>
                        ) : (
                            <span className="badge bg-light text-muted fs-6 border">Aucune note</span>
                        )}
                        
                        <span className="badge bg-primary fs-6">{new Date(film.date_de_sortie).getFullYear()}</span>
                        <span className="badge bg-secondary fs-6">{film.duree} min</span>
                    </div>

                    <div className="mb-3">
                        {film.Genres?.map((g: any) => (
                            <span key={g.id_genre} className="badge bg-info text-dark me-2 fs-6">
                                {g.nom}
                            </span>
                        ))}
                    </div>

                    <hr className="text-muted" />

                    <div className="mb-4">
                        <h5 className="text-uppercase text-muted small fw-bold">Réalisé par</h5>
                        <p className="fs-5">
                            {film.Realisateur ? `${film.Realisateur.prenom} ${film.Realisateur.nom}` : "Inconnu"}
                        </p>
                    </div>

                    <div className="mb-4">
                        <h5 className="text-uppercase text-muted small fw-bold">Synopsis</h5>
                        <p className="lead">{film.description}</p>
                    </div>

                    <div className="mb-4">
                        <h5 className="text-uppercase text-muted small fw-bold">Distribution</h5>
                        <div className="d-flex flex-wrap gap-2">
                            {film.Acteurs?.map((a: any) => (
                                <span key={a.id_acteurs} className="border p-2 rounded bg-white shadow-sm">
                                    👤 {a.prenom} {a.nom}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};