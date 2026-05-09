import { Link } from 'react-router-dom';
import { UserProfile } from './UserProfile'; // Assure-toi que le chemin est correct

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
            <div className="container">
                {/* Logo / Titre du site */}
                <Link className="navbar-brand fw-bold" to="/films">
                    🎬 MyMovieApp
                </Link>

                {/* Bouton pour mobile */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Liens de navigation à gauche */}
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/films">Catalogue</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/watchlist">Ma Liste</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/rated">Mes Avis</Link>
                        </li>
                    </ul>

                    {/* ✅ PROFIL UTILISATEUR À DROITE */}
                    <div className="ms-auto d-flex align-items-center">
                        <UserProfile />
                    </div>
                </div>
            </div>
        </nav>
    );
};