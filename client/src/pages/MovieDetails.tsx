import { useParams, Link } from "react-router-dom";

export const MovieDetails = () => {
    const { id } = useParams<{ id: string }>();

    // Base de données factice entièrement en français 
    // et alignée avec les noms de ton backend (titre, realisateur, etc.)
    const moviesDatabase: Record<string, any> = {
        "1": { 
            titre: "Inception", 
            dateDeSortie: 2010, 
            genres: "Science-fiction", 
            realisateur: "Christopher Nolan", 
            duree: "148 min", 
            acteurs: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
            moyenne: 4.8,
            synopsis: "Un voleur qui s'approprie les secrets de ses victimes en s'infiltrant dans leurs rêves se voit proposer une tâche inverse : implanter une idée dans l'esprit d'un PDG.", 
            img: "https://via.placeholder.com/400x600?text=Inception" 
        },
        "2": { 
            titre: "Interstellar", 
            dateDeSortie: 2014, 
            genres: "Science-fiction", 
            realisateur: "Christopher Nolan", 
            duree: "169 min", 
            acteurs: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
            moyenne: 4.9,
            synopsis: "Une équipe d'explorateurs voyage à travers un trou de ver dans l'espace dans le but de garantir la survie de l'humanité.", 
            img: "https://via.placeholder.com/400x600?text=Interstellar" 
        },
        "3": { 
            titre: "The Dark Knight : Le Chevalier Noir", 
            dateDeSortie: 2008, 
            genres: "Action", 
            realisateur: "Christopher Nolan", 
            duree: "152 min", 
            acteurs: "Christian Bale, Heath Ledger, Aaron Eckhart",
            moyenne: 4.7,
            synopsis: "Batman s'allie au lieutenant Gordon et au procureur Harvey Dent pour démanteler les organisations criminelles de Gotham City, mais ils se heurtent au Joker.", 
            img: "https://via.placeholder.com/400x600?text=Dark+Knight" 
        },
        "4": { 
            titre: "Dune", 
            dateDeSortie: 2021, 
            genres: "Science-fiction", 
            realisateur: "Denis Villeneuve", 
            duree: "155 min", 
            acteurs: "Timothée Chalamet, Rebecca Ferguson, Zendaya",
            moyenne: 4.5,
            synopsis: "L'histoire de Paul Atreides, un jeune homme doué voué à un grand destin qui doit se rendre sur la planète la plus dangereuse de l'univers.", 
            img: "https://via.placeholder.com/400x600?text=Dune" 
        },
    };

    const movie = id ? moviesDatabase[id] : null;

    if (!movie) {
        return (
            <div className="container mt-5 text-center">
                <h2>Film introuvable</h2>
                <Link to="/films" className="btn btn-primary mt-3">Retour à la liste des films</Link>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Link to="/films" className="btn btn-outline-secondary mb-4">← Retour aux films</Link>
            
            <div className="row">
                <div className="col-md-4">
                    <img src={movie.img} alt={movie.titre} className="img-fluid rounded shadow" />
                </div>
                <div className="col-md-8">
                    <div className="d-flex justify-content-between align-items-start">
                        {/* Utilisation de movie.titre et movie.dateDeSortie */}
                        <h1 className="fw-bold">{movie.titre} <span className="text-muted fs-4">({movie.dateDeSortie})</span></h1>
                        
                        <div className="text-center">
                            <span className="badge bg-warning text-dark fs-5 shadow-sm">
                                ⭐ {movie.moyenne} / 5
                            </span>
                        </div>
                    </div>

                    <div className="mb-3 mt-2">
                        {/* Utilisation de movie.genres et movie.duree */}
                        <span className="badge bg-secondary me-2">{movie.genres}</span>
                        <span className="text-muted">{movie.duree}</span>
                    </div>

                    {/* Utilisation de movie.realisateur */}
                    <p className="mb-1"><strong>Réalisateur :</strong> {movie.realisateur}</p>
                    
                    <p><strong>Acteurs :</strong> {movie.acteurs}</p>
                    
                    <h4 className="mt-4 border-bottom pb-2">Synopsis</h4>
                    <p className="lead fs-6">{movie.synopsis}</p>
                    
                    <div className="mt-4 p-3 bg-light rounded border">
                        <h6>Votre avis compte</h6>
                        <button className="btn btn-primary me-2">Ajouter à la Watchlist</button>
                        <button className="btn btn-outline-success">Noter ce film</button>
                    </div>
                </div>
            </div>
        </div>
    );
};