import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 

export const Movies = () => {
    // 1. Mise à jour des fausses données pour inclure les champs filtrables
    const [moviesList] = useState([
        { id: 1, titre: "Inception", dateDeSortie: 2010, genres: "Science-fiction", realisateur: "Christopher Nolan", acteurs: "Leonardo DiCaprio, Elliot Page", moyenne: 4.8, img: "https://via.placeholder.com/300x450?text=Inception" },
        { id: 2, titre: "Interstellar", dateDeSortie: 2014, genres: "Science-fiction", realisateur: "Christopher Nolan", acteurs: "Matthew McConaughey, Anne Hathaway", moyenne: 4.9, img: "https://via.placeholder.com/300x450?text=Interstellar" },
        { id: 3, titre: "The Dark Knight", dateDeSortie: 2008, genres: "Action", realisateur: "Christopher Nolan", acteurs: "Christian Bale, Heath Ledger", moyenne: 4.7, img: "https://via.placeholder.com/300x450?text=Dark+Knight" },
        { id: 4, titre: "Dune", dateDeSortie: 2021, genres: "Science-fiction", realisateur: "Denis Villeneuve", acteurs: "Timothée Chalamet, Zendaya", moyenne: 4.5, img: "https://via.placeholder.com/300x450?text=Dune" },
    ]);

    // 2. États pour stocker les valeurs des filtres
    const [searchTerm, setSearchTerm] = useState("");
    const [genreFilter, setGenreFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [minRatingFilter, setMinRatingFilter] = useState("");

    // Extraction des genres uniques pour le menu déroulant
    const uniqueGenres = Array.from(new Set(moviesList.map(movie => movie.genres)));

    // 3. Logique de filtrage combinée
    const filteredMovies = moviesList.filter(movie => {
        // Filtre de recherche textuelle (titre, auteur ou acteur)
        const lowerCaseSearch = searchTerm.toLowerCase();
        const matchesSearch = 
            movie.titre.toLowerCase().includes(lowerCaseSearch) ||
            movie.realisateur.toLowerCase().includes(lowerCaseSearch) ||
            movie.acteurs.toLowerCase().includes(lowerCaseSearch);

        // Filtre par genre
        const matchesGenre = genreFilter === "" || movie.genres === genreFilter;

        // Filtre par année (vérifie si l'année contient ce qui est tapé)
        const matchesYear = yearFilter === "" || movie.dateDeSortie.toString().includes(yearFilter);

        // Filtre par note minimale
        const matchesRating = minRatingFilter === "" || movie.moyenne >= parseFloat(minRatingFilter);

        // Le film doit correspondre à TOUS les filtres actifs
        return matchesSearch && matchesGenre && matchesYear && matchesRating;
    });

    return (
        <div className="container mt-4">
            <h1 className="custom-title mb-4">Catalogue de Films</h1>

            {/* 4. Barre de filtres (Interface Utilisateur) */}
            <div className="card shadow-sm border-0 mb-5 p-3 bg-white">
                <div className="row g-3">
                    {/* Recherche par mot-clé */}
                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">Recherche (Titre, Acteur, Réalisateur)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Ex: Nolan, Bale, Dune..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Filtre par Genre */}
                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">Genre</label>
                        <select 
                            className="form-select" 
                            value={genreFilter}
                            onChange={(e) => setGenreFilter(e.target.value)}
                        >
                            <option value="">Tous les genres</option>
                            {uniqueGenres.map((genre, index) => (
                                <option key={index} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtre par Année */}
                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">Année</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Ex: 2014" 
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                        />
                    </div>

                    {/* Filtre par Note minimale */}
                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">Note minimale</label>
                        <select 
                            className="form-select" 
                            value={minRatingFilter}
                            onChange={(e) => setMinRatingFilter(e.target.value)}
                        >
                            <option value="">Toutes les notes</option>
                            <option value="3">⭐ 3+ / 5</option>
                            <option value="4">⭐ 4+ / 5</option>
                            <option value="4.5">⭐ 4.5+ / 5</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Affichage du nombre de résultats */}
            <p className="text-muted mb-4">{filteredMovies.length} film(s) trouvé(s)</p>

            {/* 5. Affichage de la liste filtrée */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {filteredMovies.map(movie => (
                    <div className="col" key={movie.id}>
                        <div className="card h-100 shadow-sm border-0 movie-card-hover">
                            <Link to={`/films/${movie.id}`}>
                                <img src={movie.img} className="card-img-top" alt={movie.titre} style={{ cursor: "pointer" }} />
                            </Link>
                            
                            <div className="card-body">
                                <Link to={`/films/${movie.id}`} className="text-decoration-none text-dark">
                                    <h5 className="card-title text-truncate fw-bold">{movie.titre}</h5>
                                </Link>
                                
                                <p className="card-text text-muted mb-0">{movie.dateDeSortie}</p>
                                
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <span className="badge bg-secondary">{movie.genres}</span>
                                    <span className="text-warning fw-bold">⭐ {movie.moyenne}</span>
                                </div>
                            </div>
                            
                            <div className="card-footer bg-white border-top-0 pb-3 d-flex flex-column gap-2">
                                <Link to={`/films/${movie.id}`} className="btn btn-outline-dark btn-sm w-100">
                                    Voir les détails
                                </Link>
                                <button className="btn btn-outline-primary btn-sm w-100">+ Watchlist</button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Message si aucun résultat */}
                {filteredMovies.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <h4 className="text-muted">Aucun film ne correspond à vos critères.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};