import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="container mt-4">
            <div className="p-5 mb-4 bg-dark text-white rounded-3 shadow">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Bienvenue sur MovieApp</h1>
                    <p className="col-md-8 fs-4">
                        Découvrez de nouveaux films, notez vos œuvres préférées et gérez votre liste de films à voir (Watchlist).
                    </p>
                    <Link to="/films" className="btn btn-primary btn-lg mt-3">
                        Explorer le catalogue
                    </Link>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-4 text-center">
                    <h3>🎬 Découvrez</h3>
                    <p>Parcourez un vaste catalogue de films de tous les genres.</p>
                </div>
                <div className="col-md-4 text-center">
                    <h3>⭐ Notez</h3>
                    <p>Donnez votre avis et gardez une trace de ce que vous avez aimé.</p>
                </div>
                <div className="col-md-4 text-center">
                    <h3>📝 Planifiez</h3>
                    <p>Ajoutez des films à votre watchlist pour vos prochaines soirées.</p>
                </div>
            </div>
        </div>
    );
};