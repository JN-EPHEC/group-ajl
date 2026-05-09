import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
    const [pseudonyme, setPseudonyme] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pseudonyme, mail, password })
            });

            if (response.ok) {
                // Inscription réussie -> redirection vers la connexion
                alert("Compte créé avec succès !");
                navigate("/login");
            } else {
                const data = await response.json();
                setError(data.error || "Erreur lors de la création du compte");
            }
        } catch (err) {
            setError("Impossible de contacter le serveur");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Créer un compte</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label className="form-label">Pseudonyme</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={pseudonyme}
                                        onChange={(e) => setPseudonyme(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        value={mail}
                                        onChange={(e) => setMail(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mot de passe</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                                <button type="submit" className="btn btn-success w-100 mb-3">
                                    S'inscrire
                                </button>
                                <div className="text-center">
                                    <Link to="/login" className="text-decoration-none">
                                        Déjà un compte ? Se connecter
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};