import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from './UserProfile';

export const Navbar = () => {
    // État pour savoir si le menu mobile est ouvert ou fermé
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fonction pour basculer l'état
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Fonction pour fermer le menu (utile quand on clique sur un lien)
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
            <div className="container">
                {/* Logo / Titre du site */}
                <Link className="navbar-brand fw-bold" to="/films" onClick={closeMenu}>
                    🎬 MyMovieApp
                </Link>

                {/* Bouton pour mobile : Remplacement des data-bs-* par un onClick React */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    onClick={toggleMenu}
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Ajout dynamique de la classe "show" si isMenuOpen est true */}
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                    {/* Liens de navigation à gauche */}
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/films" onClick={closeMenu}>Catalogue</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/watchlist" onClick={closeMenu}>Ma Liste</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/rated" onClick={closeMenu}>Mes Avis</Link>
                        </li>
                    </ul>

                    {/* ✅ PROFIL UTILISATEUR À DROITE */}
                    <div className="ms-auto d-flex align-items-center" onClick={closeMenu}>
                        <UserProfile />
                    </div>
                </div>
            </div>
        </nav>
    );
};