export const Profile = () => {
    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center p-4">
                        <img 
                            src="https://via.placeholder.com/150" 
                            alt="Avatar" 
                            className="rounded-circle mx-auto mb-3" 
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                        />
                        <h4>John Doe</h4>
                        <p className="text-muted">Membre depuis Janvier 2024</p>
                        <button className="btn btn-outline-secondary btn-sm">Éditer le profil</button>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Statistiques</h5>
                            <div className="row text-center">
                                <div className="col-4">
                                    <h2 className="text-primary">42</h2>
                                    <p className="text-muted">Films vus</p>
                                </div>
                                <div className="col-4">
                                    <h2 className="text-warning">15</h2>
                                    <p className="text-muted">Avis rédigés</p>
                                </div>
                                <div className="col-4">
                                    <h2 className="text-success">8</h2>
                                    <p className="text-muted">Dans la watchlist</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title">Paramètres du compte</h5>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Adresse Email</label>
                                    <input type="email" className="form-control" value="john.doe@example.com" disabled />
                                </div>
                                <button type="button" className="btn btn-danger">Se déconnecter</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};