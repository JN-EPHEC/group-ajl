import { useState, useEffect } from 'react';

export const UserProfile = () => {
    const [user, setUser] = useState<any>(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const userId = 1;

    useEffect(() => {
        // ✅ Rappel : Toujours utiliser /api/
        fetch(`${API_URL}/api/users/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error("Erreur profil Navbar:", err));
    }, [API_URL]);

    if (!user) return <small className="text-muted">Connexion...</small>;

    return (
        <div className="d-flex align-items-center gap-2 text-white">
            {/* Infos texte */}
            <div className="text-end d-none d-sm-block">
                <div className="fw-bold lh-1" style={{ fontSize: '0.9rem' }}>{user.pseudonyme}</div>
                <small className="text-info" style={{ fontSize: '0.75rem' }}>Utilisateur #1</small>
            </div>

            {/* Avatar circulaire */}
            <div className="bg-info text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                 style={{ width: '35px', height: '35px', fontSize: '0.9rem' }}>
                {user.pseudonyme.charAt(0).toUpperCase()}
            </div>
        </div>
    );
};