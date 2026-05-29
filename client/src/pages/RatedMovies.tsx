import { useState, useEffect } from 'react';
import '../index.css'; 

export const RatedMovies = () => {
    const [ratedMovies, setRatedMovies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/users-notes`);
                if (!res.ok) throw new Error("Erreur lors de la récupération des notes");

                const data = await res.json();

                const enriched = await Promise.all(
                    data.map(async (item: any) => {
                        try {
                            const resFilm = await fetch(`${API_URL}/films/${item.id_film}`);
                            const film = await resFilm.json();

                            return {
                                ...item,
                                Film: {
                                    ...item.Film,
                                    img: film.img
                                }
                            };
                        } catch {
                            return item;
                        }
                    })
                );

                setRatedMovies([...enriched].reverse());
                setIsLoading(false);

            } catch (err: any) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [API_URL]);

    if (isLoading) return (
        <div className="container mt-4 text-center">
            <h4>Chargement des avis...</h4>
        </div>
    );

    if (error) return (
        <div className="container mt-4 text-danger text-center">
            <h4>Erreur : {error}</h4>
        </div>
    );

    return (
        <div className="container mt-4">

            <h1 className="mb-4 fw-bold">Derniers Avis</h1>

            {/* FLEX WRAP AU LIEU DE COLUMN */}
            <div className="d-flex flex-wrap gap-3">

                {ratedMovies.length > 0 ? (
                    ratedMovies.map((item) => (

                        <div
                            key={`${item.id_user}-${item.id_film}`}
                            className="card shadow-sm border-0 overflow-hidden"
                            style={{ width: "32%" }}
                        >

                            <div className="row g-0 h-100">

                                {/* AFFICHE */}
                                <div
                                    className="col-md-3 p-0"
                                    style={{
                                        minHeight: "100%",
                                        display: "flex"
                                    }}
                                >
                                    <img
                                        src={
                                            item.Film?.img ||
                                            "https://via.placeholder.com/200x300?text=No+Image"
                                        }
                                        alt={item.Film?.titre}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block"
                                        }}
                                    />
                                </div>

                                {/* CONTENU */}
                                <div className="col-md-8">
                                    <div className="card-body d-flex flex-column h-100">

                                        {/* TITRE + USER */}
                                        <div className="d-flex justify-content-between align-items-start">

                                            <div>
                                                <h5 className="fw-bold mb-1">
                                                    {item.Film?.titre || `Film #${item.id_film}`}
                                                </h5>

                                                <small className="text-muted">
                                                    par {item.User?.pseudonyme || "Anonyme"}
                                                </small>
                                            </div>

                                            {/* NOTE */}
                                            <div className="text-warning fw-bold">
                                                {item.note}/10{" "}
                                                <span>
                                                    {"★".repeat(Math.floor(item.note))}
                                                    {"☆".repeat(10 - Math.floor(item.note))}
                                                </span>
                                            </div>

                                        </div>

                                        {/* COMMENTAIRE */}
                                        <p className="mt-3 mb-2 fst-italic text-secondary">
                                            "{item.commentaire || "Pas de commentaire."}"
                                        </p>

                                        {/* FOOTER */}
                                        <div className="d-flex justify-content-between align-items-center mt-auto pt-3">

                                            <a
                                                href={`/films/${item.id_film}`}
                                                className="btn btn-sm btn-dark"
                                            >
                                                Voir le film
                                            </a>

                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>

                    ))
                ) : (
                    <div className="text-center py-5 text-muted">
                        Aucun avis n'a été publié pour le moment.
                    </div>
                )}

            </div>

        </div>
    );
};