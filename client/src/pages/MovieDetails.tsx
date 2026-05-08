import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export const MovieDetails = () => {
    const { id } = useParams(); // Récupère l'ID du film dans l'URL
    const [movie, setMovie] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/films/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Impossible de charger les détails du film");
                return res.json();
            })
            .then(data => {
                setMovie(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [id, API_URL]);

    if (isLoading) return <div className="container mt-5 text-center"><h4>Chargement...</h4></div>;
    if (error || !movie) return <div className="container mt-5 text-center text-danger"><h4>{error || "Film non trouvé"}</h4></div>;

    return (
        <div className="container mt-5">
            <Link to="/films" className="btn btn-outline-dark mb-4">
                ← Retour au catalogue
            </Link>

            <div className="row g-5">
                {/* Colonne de gauche : Affiche */}
                <div className="col-md-4">
                    <img 
                        src={movie.img || "https://via.placeholder.com/400x600?text=Pas+d'image"} 
                        className="img-fluid rounded-4 shadow-lg" 
                        alt={movie.titre} 
                    />
                </div>

                {/* Colonne de droite : Informations détaillées */}
                <div className="col-md-8">
                    <h1 className="display-4 fw-bold mb-2">{movie.titre}</h1>
                    
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <span className="badge bg-secondary px-3 py-2">
                            {movie.dateDeSortie ? new Date(movie.dateDeSortie).getFullYear() : "Année inconnue"}
                        </span>
                        <span className="text-muted">
                            {movie.duree_minute} minutes
                        </span>
                        <div className="text-warning fw-bold">
                            {/* Dans ton MovieDetails.tsx */}
                            <div className="text-warning fw-bold fs-4">
                                ⭐ {movie.moyenne ? Number(movie.moyenne).toFixed(1) : "N/A"} / 5
                            </div>
                        </div>
                    </div>

                    <h5 className="text-uppercase text-muted small fw-bold">Réalisateur</h5>
                    <p className="fs-5 mb-4">
                        {movie.Realisateur ? `${movie.Realisateur.prenom} ${movie.Realisateur.nom}` : "Inconnu"}
                    </p>

                    {/* SECTION SYNOPSIS */}
                    <h5 className="text-uppercase text-muted small fw-bold">Synopsis</h5>
                    <p className="fs-5 lh-base mb-4">
                        {movie.synopsis || "Aucun résumé n'est disponible pour ce film."}
                    </p>

                    {/* SECTION GENRES */}
                    <div className="mb-5">
                        {movie.Genres?.map((genre: any) => (
                            <span key={genre.nom} className="badge rounded-pill border border-dark text-dark me-2 px-3 py-2">
                                {genre.nom}
                            </span>
                        ))}
                    </div>

                    {/* SECTION ACTEURS (Casting) */}
                    <div className="border-top pt-4">
                        <h5 className="text-uppercase text-muted small fw-bold mb-3">Casting principal</h5>
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                            {movie.Acteurs && movie.Acteurs.length > 0 ? (
                                movie.Acteurs.map((acteur: any) => (
                                    <div className="col" key={acteur.nom + acteur.prenom}>
                                        <div className="card h-100 border-0 bg-light shadow-sm">
                                            <div className="card-body p-3">
                                                <p className="card-text mb-0 fw-bold">{acteur.prenom} {acteur.nom}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted small italic">Aucun acteur renseigné pour ce film.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};