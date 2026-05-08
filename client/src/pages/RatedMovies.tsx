export const RatedMovies = () => {
    const ratedMovies = [
        { id: 1, title: "Inception", myRating: 5, review: "Chef d'oeuvre absolu !" },
        { id: 2, title: "Avatar", myRating: 3, review: "Visuellement beau, mais scénario classique." },
    ];

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Mes Films Notés</h1>
            <div className="list-group shadow-sm">
                {ratedMovies.map(movie => (
                    <div className="list-group-item list-group-item-action p-4" key={movie.id}>
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{movie.title}</h5>
                            <small className="text-warning fs-5">
                                {'★'.repeat(movie.myRating)}{'☆'.repeat(5 - movie.myRating)}
                            </small>
                        </div>
                        <p className="mb-1 text-muted">"{movie.review}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};