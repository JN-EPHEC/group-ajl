import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import des pages 
import { Home } from "./pages/Home";
import { Movies } from "./pages/Movies";
import { MovieDetails } from "./pages/MovieDetails";
import { RatedMovies } from "./pages/RatedMovies";
import { Watchlist } from "./pages/Watchlist";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function App() {
    // État pour suivre si l'utilisateur est connecté au chargement et après le login
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    // Fonction pour réinitialiser l'état lors de la déconnexion
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        setIsAuthenticated(false);
        window.location.href = "/login";
    };

    return (
        <Router>
            <div className="bg-light min-vh-100 pb-5">
                {/* Barre de navigation dynamique */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
                    <div className="container">
                        <Link className="navbar-brand fw-bold" to="/">MovieApp</Link>
                        
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarNav"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto align-items-center">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Accueil</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/films">Films</Link>
                                </li>

                                {isAuthenticated ? (
                                    /* Éléments affichés uniquement si CONNECTÉ */
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/notes">Films notés</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/watchlist">Watchlist</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/profil">Profil</Link>
                                        </li>
                                        <li className="nav-item ms-lg-2">
                                            <button 
                                                className="btn btn-outline-danger btn-sm" 
                                                onClick={handleLogout}
                                            >
                                                Déconnexion
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    /* Éléments affichés uniquement si DÉCONNECTÉ */
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/login">Connexion</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-info" to="/register">Inscription</Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Définition de toutes les routes de l'application */}
                <main>
                    <Routes>
                        {/* Routes de base */}
                        <Route path="/" element={<Home />} />
                        <Route path="/films" element={<Movies />} />
                        <Route path="/films/:id" element={<MovieDetails />} />
                        <Route path="/notes" element={<RatedMovies />} />
                        
                        {/* Routes utilisateur */}
                        <Route path="/watchlist" element={<Watchlist />} />
                        <Route path="/profil" element={<Profile />} />
                        
                        {/* Routes d'authentification */}
                        <Route 
                            path="/login" 
                            element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} 
                        />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;