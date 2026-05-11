import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../index.css';

interface UserReview {
    id_user: number;
    id_film: number;
    note: number;
    commentaire: string;
    User?: { pseudonyme: string };
}

export const MovieDetails = () => {
    const { id } = useParams<{ id: string }>();

    const [film, setFilm] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [feedback, setFeedback] = useState<{ type: string, msg: string } | null>(null);

    const [reviewFeedback, setReviewFeedback] = useState<{ type: string, msg: string } | null>(null);

    // Avis utilisateur connecté
    const [userReview, setUserReview] = useState<UserReview | null>(null);

    const [reviewForm, setReviewForm] = useState({
        note: 10,
        commentaire: ""
    });

    const [isEditingReview, setIsEditingReview] = useState(false);

    // Tous les avis
    const [allReviews, setAllReviews] = useState<UserReview[]>([]);

    const API_URL = import.meta.env.VITE_API_URL;

    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    // Récupération des avis
    const fetchAllReviews = () => {
        fetch(`${API_URL}/users-notes/film/${id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAllReviews(data);
                }
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {

        // Film
        fetch(`${API_URL}/films/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Film introuvable");
                }

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

        // Avis utilisateur
        if (userId && token) {

            fetch(`${API_URL}/users-notes/${userId}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }

                    return null;
                })
                .then(data => {
                    if (data) {

                        setUserReview(data);

                        setReviewForm({
                            note: data.note,
                            commentaire: data.commentaire || ""
                        });
                    }
                })
                .catch(err => console.error(err));
        }

        // Tous les avis
        fetchAllReviews();

    }, [id, API_URL, userId, token]);

    // Ajouter à la watchlist
    const handleAddToWatchlist = async () => {

        if (!userId || !token) {

            setFeedback({
                type: "danger",
                msg: "Veuillez vous connecter."
            });

            return;
        }

        setIsAdding(true);
        setFeedback(null);

        try {

            const response = await fetch(`${API_URL}/users/${userId}/watchlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_film: parseInt(id || "0")
                })
            });

            if (response.ok) {

                setFeedback({
                    type: "success",
                    msg: "Ajouté à votre liste 🍿"
                });

            } else {

                setFeedback({
                    type: "warning",
                    msg: "Déjà dans votre liste."
                });
            }

        } catch (err) {

            setFeedback({
                type: "danger",
                msg: "Erreur lors de l'ajout."
            });

        } finally {
            setIsAdding(false);
        }
    };

    // Ajouter / Modifier un avis
    const handleSubmitReview = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!userId || !token) {

            setReviewFeedback({
                type: "danger",
                msg: "Vous devez être connecté."
            });

            return;
        }

        const method = userReview ? "PUT" : "POST";

        const url = userReview
            ? `${API_URL}/users-notes/${userId}/${id}`
            : `${API_URL}/users-notes/`;

        const bodyData = userReview
            ? {
                note: reviewForm.note,
                commentaire: reviewForm.commentaire
            }
            : {
                id_user: parseInt(userId),
                id_film: parseInt(id || "0"),
                note: reviewForm.note,
                commentaire: reviewForm.commentaire
            };

        try {

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            });

            if (res.ok) {

                const updatedReview = await res.json();

                setUserReview(updatedReview);

                setIsEditingReview(false);

                setReviewFeedback({
                    type: "success",
                    msg: userReview
                        ? "Avis modifié avec succès."
                        : "Avis ajouté avec succès."
                });

                fetchAllReviews();

            } else {

                setReviewFeedback({
                    type: "danger",
                    msg: "Erreur lors de l'enregistrement."
                });
            }

        } catch (err) {

            console.error(err);

            setReviewFeedback({
                type: "danger",
                msg: "Une erreur est survenue."
            });
        }
    };

    // Supprimer avis
    const handleDeleteReview = async () => {

        if (!userId || !token) return;

        try {

            const res = await fetch(`${API_URL}/users-notes/${userId}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {

                setUserReview(null);

                setReviewForm({
                    note: 10,
                    commentaire: ""
                });

                setIsEditingReview(false);

                setReviewFeedback({
                    type: "success",
                    msg: "Avis supprimé."
                });

                fetchAllReviews();

            } else {

                setReviewFeedback({
                    type: "danger",
                    msg: "Erreur lors de la suppression."
                });
            }

        } catch (err) {

            console.error(err);

            setReviewFeedback({
                type: "danger",
                msg: "Une erreur est survenue."
            });
        }
    };

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <h3>Chargement...</h3>
            </div>
        );
    }

    if (error || !film) {
        return (
            <div className="container mt-5 text-center text-danger">
                <h3>{error}</h3>
            </div>
        );
    }

    const displayNote = film.moyenne
        ? parseFloat(film.moyenne).toFixed(1)
        : null;

    return (
        <div className="container mt-5">

            <Link to="/films" className="btn btn-outline-secondary mb-4">
                ← Retour
            </Link>

            <div className="row">

                {/* Affiche */}
                <div className="col-md-4 mb-4">

                    <img
                        src={film.img}
                        alt={film.titre}
                        className="img-fluid rounded shadow-lg w-100"
                    />

                    <div className="mt-4">

                        {userId ? (
                            <>
                                <button
                                    onClick={handleAddToWatchlist}
                                    disabled={isAdding}
                                    className={`btn btn-lg w-100 ${
                                        feedback?.type === "success"
                                            ? "btn-success"
                                            : "btn-primary"
                                    }`}
                                >
                                    {isAdding
                                        ? "Ajout..."
                                        : "➕ Ma Watchlist"}
                                </button>

                                {feedback && (
                                    <p
                                        className={`mt-2 text-center fw-semibold text-${
                                            feedback.type === "success"
                                                ? "success"
                                                : feedback.type === "warning"
                                                ? "warning"
                                                : "danger"
                                        }`}
                                    >
                                        {feedback.msg}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-muted text-center mt-2">
                                <Link to="/login" className="fw-bold">
                                    Connectez-vous
                                </Link>{" "}
                                pour ajouter ce film à votre Watchlist.
                            </p>
                        )}
                    </div>
                </div>

                {/* Infos */}
                <div className="col-md-8 px-4">

                    <h1 className="display-4 fw-bold">
                        {film.titre}
                    </h1>

                    <div className="d-flex align-items-center gap-3 my-3">

                        {displayNote ? (
                            <span className="badge bg-warning text-dark fs-5 shadow-sm">
                                ⭐ {displayNote} / 10
                            </span>
                        ) : (
                            <span className="badge bg-light text-muted fs-6 border">
                                Aucune note
                            </span>
                        )}

                        <span className="badge bg-primary fs-6">
                            {new Date(film.date_de_sortie).getFullYear()}
                        </span>

                        <span className="badge bg-secondary fs-6">
                            {film.duree} min
                        </span>
                    </div>

                    <div className="mb-3">
                        {film.Genres?.map((g: any) => (
                            <span
                                key={g.id_genre}
                                className="badge bg-info text-dark me-2 fs-6"
                            >
                                {g.nom}
                            </span>
                        ))}
                    </div>

                    <hr className="text-muted" />

                    <div className="mb-4">

                        <h5 className="text-uppercase text-muted small fw-bold">
                            Réalisé par
                        </h5>

                        <p className="fs-5">
                            {film.Realisateur
                                ? `${film.Realisateur.prenom} ${film.Realisateur.nom}`
                                : "Inconnu"}
                        </p>
                    </div>

                    <div className="mb-4">

                        <h5 className="text-uppercase text-muted small fw-bold">
                            Distribution
                        </h5>

                        <div className="d-flex flex-wrap gap-2">

                            {film.Acteurs?.map((a: any) => (
                                <span
                                    key={a.id_acteurs}
                                    className="border p-2 rounded bg-white shadow-sm"
                                >
                                    👤 {a.prenom} {a.nom}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <hr className="text-muted my-5" />

            {/* MON AVIS */}
            <div className="mb-5 bg-light p-4 rounded shadow-sm">

                <h4 className="fw-bold mb-3">
                    Mon Avis
                </h4>

                {reviewFeedback && (
                    <p
                        className={`mb-3 fw-semibold text-${
                            reviewFeedback.type === "success"
                                ? "success"
                                : "danger"
                        }`}
                    >
                        {reviewFeedback.msg}
                    </p>
                )}

                {!userId ? (

                    <p className="text-muted mb-0">
                        Vous devez être{" "}
                        <Link
                            to="/login"
                            className="text-decoration-none fw-bold"
                        >
                            connecté
                        </Link>{" "}
                        pour laisser un avis.
                    </p>

                ) : userReview && !isEditingReview ? (

                    <div>

                        <p className="fs-5">
                            <span className="badge bg-warning text-dark me-2">
                                ⭐ {userReview.note} / 10
                            </span>
                        </p>

                        <p className="lead">
                            {userReview.commentaire || "Aucun commentaire."}
                        </p>

                        <div className="d-flex gap-2 mt-3">

                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setIsEditingReview(true)}
                            >
                                Modifier
                            </button>

                            <button
                                className="btn btn-outline-danger"
                                onClick={handleDeleteReview}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>

                ) : (

                    <form onSubmit={handleSubmitReview}>

                        <div className="mb-3">

                            <label className="form-label fw-bold">
                                Note sur 10
                            </label>

                            <select
                                className="form-select w-auto"
                                value={reviewForm.note}
                                onChange={(e) =>
                                    setReviewForm({
                                        ...reviewForm,
                                        note: parseFloat(e.target.value)
                                    })
                                }
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option
                                        key={i + 1}
                                        value={i + 1}
                                    >
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">

                            <label className="form-label fw-bold">
                                Commentaire
                            </label>

                            <textarea
                                className="form-control"
                                rows={3}
                                placeholder="Que pensez-vous de ce film ?"
                                value={reviewForm.commentaire}
                                onChange={(e) =>
                                    setReviewForm({
                                        ...reviewForm,
                                        commentaire: e.target.value
                                    })
                                }
                            ></textarea>
                        </div>

                        <div className="d-flex gap-2">

                            <button
                                type="submit"
                                className="btn btn-success"
                            >
                                {userReview
                                    ? "Enregistrer les modifications"
                                    : "Publier mon avis"}
                            </button>

                            {userReview && isEditingReview && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsEditingReview(false)}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>

            {/* Avis spectateurs */}
            <div className="mb-5">

                <h4 className="fw-bold mb-4">
                    💬 Avis des spectateurs ({allReviews.length})
                </h4>

                {allReviews.length === 0 ? (

                    <p className="text-muted">
                        Aucun avis publié pour ce film.
                    </p>

                ) : (

                    <div className="d-flex flex-column gap-3">

                        {allReviews.map((review) => (

                            <div
                                key={`${review.id_user}-${review.id_film}`}
                                className="card border-0 shadow-sm p-3"
                            >

                                <div className="d-flex justify-content-between align-items-center mb-2">

                                    <div className="d-flex align-items-center gap-2">

                                        <div
                                            className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                            style={{
                                                width: "35px",
                                                height: "35px",
                                                fontSize: "0.9rem"
                                            }}
                                        >
                                            {review.User?.pseudonyme
                                                ?.charAt(0)
                                                .toUpperCase() || "?"}
                                        </div>

                                        <span className="fw-bold text-dark">
                                            {review.User?.pseudonyme || "Utilisateur"}
                                        </span>

                                        {parseInt(userId || "0") === review.id_user && (
                                            <span className="badge bg-secondary ms-1 small">
                                                Moi
                                            </span>
                                        )}
                                    </div>

                                    <span className="badge bg-warning text-dark fs-6">
                                        ⭐ {review.note} / 10
                                    </span>
                                </div>

                                <p className="mb-0 text-muted">
                                    {review.commentaire || (
                                        <span className="fst-italic">
                                            Sans commentaire
                                        </span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};