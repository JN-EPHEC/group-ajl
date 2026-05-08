import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 

export const Movies = () => {
    const [moviesList, setMoviesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // États pour les filtres
    const [searchTerm, setSearchTerm] = useState("");
    const [genreFilter, setGenreFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [minRatingFilter, setMinRatingFilter] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // On récupère les films (le backend doit inclure Realisateur et Genres)
        fetch(`${API_URL}/films`)
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la récupération des films");
                return res.json();
            })
            .then(data => {
                setMoviesList(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [API_URL]);

    // Extraction des genres uniques pour le filtre
    const uniqueGenres = Array.from(new Set(
        moviesList.flatMap(m => m.Genres?.map((g: any) => g.nom) || [])
    )).filter(Boolean).sort();

    // Logique de filtrage
    const filteredMovies = moviesList.filter(movie => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        // On cherche dans le titre OU le prénom/nom du réalisateur
        const matchesSearch = 
            movie.titre?.toLowerCase().includes(lowerCaseSearch) ||
            movie.Realisateur?.nom?.toLowerCase().includes(lowerCaseSearch) ||
            movie.Realisateur?.prenom?.toLowerCase().includes(lowerCaseSearch);

        const matchesGenre = genreFilter === "" || 
            movie.Genres?.some((g: any) => g.nom === genreFilter);

        const annee = movie.dateDeSortie ? new Date(movie.dateDeSortie).getFullYear().toString() : "";
        const matchesYear = yearFilter === "" || annee.includes(yearFilter);

        // On compare avec la moyenne renvoyée par le backend (on force en nombre pour comparer)
        const noteFilm = parseFloat(movie.moyenne) || 0;
        const matchesRating = minRatingFilter === "" || noteFilm >= parseFloat(minRatingFilter);

        return matchesSearch && matchesGenre && matchesYear && matchesRating;
    });

    if (isLoading) return <div className="container mt-5 text-center"><h4>Chargement du catalogue...</h4></div>;
    if (error) return <div className="container mt-5 text-center text-danger"><h4>Erreur : {error}</h4></div>;

    return (
        <div className="container mt-4">
            <h1 className="custom-title mb-4">Catalogue de Films</h1>

            {/* Barre de Filtres */}
            <div className="card shadow-sm border-0 mb-5 p-3 bg-white">
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">Recherche (Titre, Réalisateur)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Ex: Nolan, Inception..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">Genre</label>
                        <select className="form-select" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                            <option value="">Tous les genres</option>
                            {uniqueGenres.map((genre, idx) => (
                                <option key={idx} value={genre as string}>{genre as string}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">Année</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Ex: 2024" 
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">Note minimale</label>
                        <select className="form-select" value={minRatingFilter} onChange={(e) => setMinRatingFilter(e.target.value)}>
                            <option value="">Toutes les notes</option>
                            <option value="3">⭐ 3+ / 5</option>
                            <option value="4">⭐ 4+ / 5</option>
                            <option value="4.5">⭐ 4.5+ / 5</option>
                        </select>
                    </div>
                </div>
            </div>

            <p className="text-muted mb-4">{filteredMovies.length} film(s) trouvé(s)</p>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {filteredMovies.map(movie => (
                    <div className="col" key={movie.film_id}>
                        <div className="card h-100 shadow-sm border-0 movie-card-hover">
                            <Link to={`/films/${movie.film_id}`}>
                                <img 
                                    src={movie.img || "https://via.placeholder.com/300x450?text=Pas+d'image"} 
                                    className="card-img-top" 
                                    alt={movie.titre} 
                                    style={{ height: "400px", objectFit: "cover" }}
                                />
                            </Link>
                            
                            <div className="card-body">
                                <Link to={`/films/${movie.film_id}`} className="text-decoration-none text-dark">
                                    <h5 className="card-title text-truncate fw-bold">{movie.titre}</h5>
                                </Link>
                                
                                <p className="card-text text-muted mb-1">
                                    {movie.dateDeSortie ? new Date(movie.dateDeSortie).getFullYear() : "Année inconnue"}
                                </p>

                                {/* ✅ Correction Réalisateur : Prénom + Nom */}
                                <p className="card-text small mb-2">
                                    <strong>Réal :</strong> {movie.Realisateur ? `${movie.Realisateur.prenom} ${movie.Realisateur.nom}` : "Inconnu"}
                                </p>
                                
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <div className="d-flex flex-wrap gap-1">
                                        {movie.Genres?.slice(0, 2).map((g: any) => (
                                            <span key={g.genre_id} className="badge bg-secondary small">{g.nom}</span>
                                        ))}
                                    </div>
                                    {/* ✅ Correction Note : Affichage de la moyenne formatée */}
                                    <span className="text-warning fw-bold">
                                        ⭐ {movie.moyenne ? Number(movie.moyenne).toFixed(1) : "N/A"}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="card-footer bg-white border-top-0 pb-3">
                                <Link to={`/films/${movie.film_id}`} className="btn btn-outline-dark btn-sm w-100">
                                    Voir les détails
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};