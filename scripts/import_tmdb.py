from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import requests
import os

load_dotenv()

TMDB_TOKEN = os.getenv("TMDB_TOKEN")
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

headers = {
    "Authorization": f"Bearer {TMDB_TOKEN}",
    "accept": "application/json"
}

BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500"
NB_PAGES = 5

# =========================
# TMDB ENDPOINTS
# Docs:
# https://developer.themoviedb.org/reference
# =========================

with engine.begin() as conn:

    for page in range(1, NB_PAGES + 1):

        print(f"Page {page}")

        # -------------------------
        # MOVIES POPULAR
        # https://developer.themoviedb.org/reference/movie-popular-list
        # -------------------------
        response = requests.get(
            "https://api.themoviedb.org/3/movie/popular",
            headers=headers,
            params={"page": page}
        )

        response.raise_for_status()
        movies = response.json().get("results", [])

        for movie in movies:

            movie_id = movie["id"]

            # -------------------------
            # MOVIE DETAILS + CREDITS (OPTIMISÉ avec append_to_response)
            # https://developer.themoviedb.org/docs/append-to-response
            # -------------------------
            details_response = requests.get(
                f"https://api.themoviedb.org/3/movie/{movie_id}",
                headers=headers,
                params={"append_to_response": "credits"}
            )

            details_response.raise_for_status()
            details = details_response.json()

            credits = details.get("credits", {})

            # =========================
            # DIRECTOR
            # =========================
            director_id = None

            for crew_member in credits.get("crew", []):

                if crew_member.get("job") == "Director":

                    name_parts = crew_member["name"].split(" ", 1)
                    prenom = name_parts[0]
                    nom = name_parts[1] if len(name_parts) > 1 else name_parts[0]

                    existing_director = conn.execute(
                        text("""
                            SELECT id_real
                            FROM realisateurs
                            WHERE nom = :nom AND prenom = :prenom
                        """),
                        {"nom": nom, "prenom": prenom}
                    ).fetchone()

                    if existing_director:
                        director_id = existing_director[0]

                    else:
                        director_id = conn.execute(
                            text("""
                                INSERT INTO realisateurs (nom, prenom)
                                VALUES (:nom, :prenom)
                                RETURNING id_real
                            """),
                            {"nom": nom, "prenom": prenom}
                        ).fetchone()[0]

                    break

            # =========================
            # MOVIE
            # =========================
            image_url = (
                BASE_IMAGE_URL + movie["poster_path"]
                if movie.get("poster_path")
                else None
            )

            existing_movie = conn.execute(
                text("""
                    SELECT id_film
                    FROM films
                    WHERE titre = :titre
                """),
                {"titre": movie["title"]}
            ).fetchone()

            if existing_movie:
                film_id = existing_movie[0]

            else:
                film_id = conn.execute(
                    text("""
                        INSERT INTO films (
                            titre,
                            id_real,
                            duree,
                            date_de_sortie,
                            img
                        )
                        VALUES (
                            :titre,
                            :id_real,
                            :duree,
                            :date_de_sortie,
                            :img
                        )
                        RETURNING id_film
                    """),
                    {
                        "titre": movie["title"],
                        "id_real": director_id,
                        "duree": details.get("runtime"),
                        "date_de_sortie": movie.get("release_date"),
                        "img": image_url
                    }
                ).fetchone()[0]

            # =========================
            # GENRES
            # https://developer.themoviedb.org/reference/genre-movie-list
            # =========================
            for genre in details.get("genres", []):

                genre_id = conn.execute(
                    text("""
                        SELECT id_genre
                        FROM genres
                        WHERE nom = :nom
                    """),
                    {"nom": genre["name"]}
                ).fetchone()

                if genre_id:
                    genre_id = genre_id[0]

                else:
                    genre_id = conn.execute(
                        text("""
                            INSERT INTO genres (nom)
                            VALUES (:nom)
                            RETURNING id_genre
                        """),
                        {"nom": genre["name"]}
                    ).fetchone()[0]

                # liaison
                exists = conn.execute(
                    text("""
                        SELECT 1
                        FROM genres_films
                        WHERE id_genre = :id_genre AND id_film = :id_film
                    """),
                    {"id_genre": genre_id, "id_film": film_id}
                ).fetchone()

                if not exists:
                    conn.execute(
                        text("""
                            INSERT INTO genres_films (id_genre, id_film)
                            VALUES (:id_genre, :id_film)
                        """),
                        {"id_genre": genre_id, "id_film": film_id}
                    )

            # =========================
            # ACTORS
            # =========================
            for actor in credits.get("cast", [])[:10]:

                name_parts = actor["name"].split(" ", 1)
                prenom = name_parts[0]
                nom = name_parts[1] if len(name_parts) > 1 else name_parts[0]

                actor_id = conn.execute(
                    text("""
                        SELECT id_acteurs
                        FROM acteurs
                        WHERE nom = :nom AND prenom = :prenom
                    """),
                    {"nom": nom, "prenom": prenom}
                ).fetchone()

                if actor_id:
                    actor_id = actor_id[0]

                else:
                    actor_id = conn.execute(
                        text("""
                            INSERT INTO acteurs (nom, prenom)
                            VALUES (:nom, :prenom)
                            RETURNING id_acteurs
                        """),
                        {"nom": nom, "prenom": prenom}
                    ).fetchone()[0]

                exists = conn.execute(
                    text("""
                        SELECT 1
                        FROM acteurs_films
                        WHERE id_acteurs = :id_acteurs AND id_film = :id_film
                    """),
                    {"id_acteurs": actor_id, "id_film": film_id}
                ).fetchone()

                if not exists:
                    conn.execute(
                        text("""
                            INSERT INTO acteurs_films (id_acteurs, id_film)
                            VALUES (:id_acteurs, :id_film)
                        """),
                        {"id_acteurs": actor_id, "id_film": film_id}
                    )

print("Import terminé")