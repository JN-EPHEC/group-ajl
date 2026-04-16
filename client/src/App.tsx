import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Impor des pages 

import { Home } from "./pages/Home";
import { Movies } from "./pages/Movies";
import { RatedMovies } from "./pages/RatedMovies";
import { Watchlist } from "./pages/Watchlist";
import { Profile } from "./pages/Profile";

function App() {
    return (
        <Router>
            <div className="bg-light min-vh-100 pb-5">
                {/* Barre de navigation utilisant Bootstrap */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
                    <div className="container">
                        {/* Marque de l'application */}
                        <Link className="navbar-brand fw-bold" to="/">MovieApp</Link>
                        
                        {/* Bouton pour mobile */}
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav" 
                            aria-expanded="false" 
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* Liens de navigation */}
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Accueil</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/films">Films</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/notes">Films notés</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/watchlist">Watchlist</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profil">Profil</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Contenu principal de l'application */}
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/films" element={<Movies />} />
                        <Route path="/notes" element={<RatedMovies />} />
                        <Route path="/watchlist" element={<Watchlist />} />
                        <Route path="/profil" element={<Profile />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;