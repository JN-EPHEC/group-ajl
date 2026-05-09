import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Définition du type pour les props : on attend une fonction pour signaler le succès
interface LoginProps {
    onLoginSuccess: () => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
    // États pour gérer les champs du formulaire et les messages d'erreur
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Appel à votre route de connexion backend
            const response = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Le backend attend "mail" et "password"
                body: JSON.stringify({ mail, password })
            });

            const data = await response.json();

            if (response.ok) {
                // 1. Sauvegarder les informations de session
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.user_id.toString());
                
                // 2. Prévenir App.tsx pour mettre à jour la Navbar
                onLoginSuccess();
                
                // 3. Rediriger vers la page de profil
                navigate("/profil");
            } else {
                // Gestion des erreurs renvoyées par le serveur (ex: 401 Unauthorized)
                setError(data.error || "Identifiants invalides");
            }
        } catch (err) {
            setError("Erreur de connexion au serveur. Vérifiez que le backend est lancé.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4 fw-bold">Connexion</h2>
                            
                            {/* Message d'erreur Bootstrap */}
                            {error && (
                                <div className="alert alert-danger py-2 small" role="alert">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Adresse email</label>
                                    <input 
                                        type="email" 
                                        className="form-control shadow-none" 
                                        placeholder="jean@email.com"
                                        value={mail}
                                        onChange={(e) => setMail(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold">Mot de passe</label>
                                    <input 
                                        type="password" 
                                        className="form-control shadow-none" 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 fw-bold"
                                    disabled={loading}
                                >
                                    {loading ? "Connexion en cours..." : "Se connecter"}
                                </button>
                            </form>

                            <div className="mt-4 text-center">
                                <p className="small text-muted mb-0">
                                    Pas encore de compte ? 
                                    <a href="/register" className="ms-1 text-primary text-decoration-none fw-bold">
                                        Inscrivez-vous
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};