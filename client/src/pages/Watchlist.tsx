export const Watchlist = () => {
    const watchlist = [
        { id: 1, title: "Oppenheimer", added: "Il y a 2 jours" },
        { id: 2, title: "Blade Runner 2049", added: "Il y a 1 semaine" },
    ];

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Ma Watchlist</h1>
            {watchlist.length === 0 ? (
                <div className="alert alert-info">Votre watchlist est vide. Allez dans le catalogue pour en ajouter !</div>
            ) : (
                <div className="row">
                    {watchlist.map(movie => (
                        <div className="col-md-6 mb-3" key={movie.id}>
                            <div className="card shadow-sm border-0">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0">{movie.title}</h5>
                                        <small className="text-muted">Ajouté: {movie.added}</small>
                                    </div>
                                    <div>
                                        <button className="btn btn-success btn-sm me-2">✔ Vu</button>
                                        <button className="btn btn-danger btn-sm">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};