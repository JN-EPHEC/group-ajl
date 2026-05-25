import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../index.css";

export const MoviesActor = () => {
    const [actor, setActor] = useState<any>(null);
    const [moviesList, setMoviesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { id } = useParams();

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchActorMovies = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `${API_URL}/acteurs/${id}/films`
                );

                if (!response.ok) {
                    throw new Error(
                        "Erreur lors de la récupération des films"
                    );
                }

                const data = await response.json();

                setActor(data[0].Acteurs.find(
                    (a: any) => 
                        a.id_acteurs == id
                    ));
                setMoviesList(data || []);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActorMovies();
    }, [API_URL, id]);

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <h4>Chargement des films...</h4>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5 text-center text-danger">
                <h4>Erreur : {error}</h4>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            {/* Nom acteur */}
            <div className="mb-5 text-center">

                <h1 className="custom-title mb-2">
                    Films de {actor?.prenom} {actor?.nom}
                </h1>

                <p className="text-muted">
                    {moviesList.length} film(s)
                </p>

            </div>

            {/* Liste des films */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">

                {moviesList.map((movie) => (

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

        </div>
    );
};