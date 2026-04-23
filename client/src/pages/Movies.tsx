import '../index.css'; 

export const Movies = () => {
    // Fausses données pour l'exemple
    const moviesList = [
        { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi", img: "https://via.placeholder.com/300x450?text=Inception" },
        { id: 2, title: "Interstellar", year: 2014, genre: "Sci-Fi", img: "https://via.placeholder.com/300x450?text=Interstellar" },
        { id: 3, title: "The Dark Knight", year: 2008, genre: "Action", img: "https://via.placeholder.com/300x450?text=Dark+Knight" },
        { id: 4, title: "Dune", year: 2021, genre: "Sci-Fi", img: "https://via.placeholder.com/300x450?text=Dune" },
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-5">
                {/* J'ai ajouté la classe custom-title ici 👇 */}
                <h1 className="custom-title">Catalogue de Films</h1>
                <input type="text" className="form-control w-25" placeholder="Rechercher un film..." />
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {moviesList.map(movie => (
                    <div className="col" key={movie.id}>
                        {/* J'ai ajouté la classe movie-card-hover ici 👇 */}
                        <div className="card h-100 shadow-sm border-0 movie-card-hover">
                            <img src={movie.img} className="card-img-top" alt={movie.title} />
                            <div className="card-body">
                                <h5 className="card-title text-truncate fw-bold">{movie.title}</h5>
                                <p className="card-text text-muted mb-0">{movie.year}</p>
                                <span className="badge bg-secondary mt-2">{movie.genre}</span>
                            </div>
                            <div className="card-footer bg-white border-top-0 pb-3">
                                <button className="btn btn-outline-primary btn-sm w-100">+ Watchlist</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};