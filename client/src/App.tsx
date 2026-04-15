import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Simulation de composants de pages (À extraire plus tard dans src/pages/)
const Home = () => <div className="container mt-4"><h1>Accueil</h1><p>Bienvenue sur votre application de films.</p></div>;
const Movies = () => <div className="container mt-4"><h1>Catalogue de Films</h1></div>;
const RatedMovies = () => <div className="container mt-4"><h1>Mes Films Notés</h1></div>;
const Watchlist = () => <div className="container mt-4"><h1>Ma Watchlist</h1></div>;
const Profile = () => <div className="container mt-4"><h1>Mon Profil</h1></div>;

function App() {
    return (
        <Router>
            <div className="bg-light min-vh-100">
                {/* Barre de navigation utilisant Bootstrap */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                    <div className="container">
                        <Link className="navbar-brand fw-bold" to="/">MovieApp</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
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

                {/* Contenu dynamique basé sur l'URL */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/films" element={<Movies />} />
                    <Route path="/notes" element={<RatedMovies />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/profil" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;