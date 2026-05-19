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
    
    // État pour le tri
    const [sortOrder, setSortOrder] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 12;

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
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

    // Reset pagination quand les filtres changent
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, genreFilter, yearFilter, minRatingFilter, sortOrder]);

    // Genres uniques
    const uniqueGenres = Array.from(new Set(
        moviesList.flatMap(m => m.Genres?.map((g: any) => g.nom) || [])
    )).filter(Boolean).sort();

    // Filtrage + tri
    const filteredMovies = moviesList.filter(movie => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        const matchesSearch = 
            movie.titre?.toLowerCase().includes(lowerCaseSearch) ||
            movie.Realisateur?.nom?.toLowerCase().includes(lowerCaseSearch) ||
            movie.Realisateur?.prenom?.toLowerCase().includes(lowerCaseSearch);

        const matchesGenre = genreFilter === "" || 
            movie.Genres?.some((g: any) => g.nom === genreFilter);

        const annee = movie.date_de_sortie
            ? new Date(movie.date_de_sortie).getFullYear().toString()
            : "";

        const matchesYear =
            yearFilter === "" || annee.includes(yearFilter);

        const noteFilm = parseFloat(movie.moyenne) || 0;

        const matchesRating =
            minRatingFilter === "" ||
            noteFilm >= parseFloat(minRatingFilter);

        return (
            matchesSearch &&
            matchesGenre &&
            matchesYear &&
            matchesRating
        );
    }).sort((a, b) => {
        if (sortOrder === "note-desc") {
            const noteA = parseFloat(a.moyenne) || 0;
            const noteB = parseFloat(b.moyenne) || 0;
            return noteB - noteA;
        } else if (sortOrder === "alpha") {
            return (a.titre || "").localeCompare(b.titre || "");
        }

        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(
        filteredMovies.length / moviesPerPage
    );

    const startIndex =
        (currentPage - 1) * moviesPerPage;

    const endIndex =
        startIndex + moviesPerPage;

    const currentMovies =
        filteredMovies.slice(startIndex, endIndex);

    if (isLoading)
        return (
            <div className="container mt-5 text-center">
                <h4>Chargement du catalogue...</h4>
            </div>
        );

    if (error)
        return (
            <div className="container mt-5 text-center text-danger">
                <h4>Erreur : {error}</h4>
            </div>
        );

    return (
        <div className="container mt-4">

            <h1 className="custom-title mb-4">
                Catalogue de Films
            </h1>

            {/* Barre de filtres */}
            <div className="card shadow-sm border-0 mb-5 p-3 bg-white">

                <div className="row g-3">

                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">
                            Recherche
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex: Nolan, Inception..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">
                            Genre
                        </label>

                        <select
                            className="form-select"
                            value={genreFilter}
                            onChange={(e) =>
                                setGenreFilter(e.target.value)
                            }
                        >
                            <option value="">
                                Tous les genres
                            </option>

                            {uniqueGenres.map((genre, idx) => (
                                <option
                                    key={idx}
                                    value={genre as string}
                                >
                                    {genre as string}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">
                            Année
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            placeholder="Ex: 2024"
                            value={yearFilter}
                            onChange={(e) =>
                                setYearFilter(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">
                            Note minimale
                        </label>

                        <select
                            className="form-select"
                            value={minRatingFilter}
                            onChange={(e) =>
                                setMinRatingFilter(e.target.value)
                            }
                        >
                            <option value="">
                                Toutes les notes
                            </option>

                            <option value="6">
                                ⭐ 6+ / 10
                            </option>

                            <option value="7">
                                ⭐ 7+ / 10
                            </option>

                            <option value="8">
                                ⭐ 8+ / 10
                            </option>

                            <option value="9">
                                ⭐ 9+ / 10
                            </option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label text-muted small mb-1">
                            Trier par
                        </label>

                        <select
                            className="form-select"
                            value={sortOrder}
                            onChange={(e) =>
                                setSortOrder(e.target.value)
                            }
                        >
                            <option value="">
                                Ordre par défaut
                            </option>

                            <option value="note-desc">
                                ⭐ Mieux notés
                            </option>

                            <option value="alpha">
                                🔤 De A à Z
                            </option>
                        </select>
                    </div>

                </div>
            </div>

            <p className="text-muted mb-4">
                {filteredMovies.length} film(s) trouvé(s)
            </p>

            {/* Films */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">

                {currentMovies.map(movie => (

                    <div
                        className="col"
                        key={movie.id_film}
                    >
                        <div className="card h-100 shadow-sm border-0 movie-card-hover">

                            <Link to={`/films/${movie.id_film}`}>
                                <img
                                    src={
                                        movie.img ||
                                        "https://via.placeholder.com/300x450?text=Pas+d'image"
                                    }
                                    className="card-img-top"
                                    alt={movie.titre}
                                    style={{
                                        height: "400px",
                                        objectFit: "cover"
                                    }}
                                />
                            </Link>

                            <div className="card-body">

                                <Link
                                    to={`/films/${movie.id_film}`}
                                    className="text-decoration-none text-dark"
                                >
                                    <h5 className="card-title text-truncate fw-bold">
                                        {movie.titre}
                                    </h5>
                                </Link>

                                <p className="card-text text-muted mb-1">
                                    {movie.date_de_sortie
                                        ? new Date(
                                            movie.date_de_sortie
                                          ).getFullYear()
                                        : "Année inconnue"}
                                </p>

                                <p className="card-text small mb-2">
                                    <strong>Réal :</strong>{" "}
                                    {movie.Realisateur
                                        ? `${movie.Realisateur.prenom} ${movie.Realisateur.nom}`
                                        : "Inconnu"}
                                </p>

                                <div className="d-flex justify-content-between align-items-center mt-2">

                                    <div className="d-flex flex-wrap gap-1">
                                        {movie.Genres?.slice(0, 2).map((g: any) => (
                                            <span
                                                key={g.id_genre}
                                                className="badge bg-secondary small"
                                            >
                                                {g.nom}
                                            </span>
                                        ))}
                                    </div>

                                    <span className="text-warning fw-bold">
                                        ⭐ {movie.moyenne
                                            ? Number(movie.moyenne).toFixed(1)
                                            : "N/A"}
                                    </span>

                                </div>
                            </div>

                            <div className="card-footer bg-white border-top-0 pb-3">
                                <Link
                                    to={`/films/${movie.id_film}`}
                                    className="btn btn-outline-dark btn-sm w-100"
                                >
                                    Voir les détails
                                </Link>
                            </div>

                        </div>
                    </div>

                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-5 gap-2 flex-wrap">

                <button
                    className="btn btn-outline-dark"
                    disabled={currentPage === 1}
                    onClick={() =>
                        setCurrentPage(currentPage - 1)
                    }
                >
                    ←
                </button>

                {Array.from(
                    { length: totalPages },
                    (_, index) => (
                        <button
                            key={index}
                            className={`btn ${
                                currentPage === index + 1
                                    ? 'btn-dark'
                                    : 'btn-outline-dark'
                            }`}
                            onClick={() =>
                                setCurrentPage(index + 1)
                            }
                        >
                            {index + 1}
                        </button>
                    )
                )}

                <button
                    className="btn btn-outline-dark"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                        setCurrentPage(currentPage + 1)
                    }
                >
                    →
                </button>

            </div>

        </div>
    );
};