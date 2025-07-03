import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TMDB_BASE_URL, API_KEY } from "../utils/constants";

export default function MovieDetails() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(location.state?.movie || null);

  useEffect(() => {
    // Si movie n'est pas passé via location.state, on va le chercher via TMDB
    if (!movie) {
      axios
        .get(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`)
        .then(({ data }) => {
          setMovie({
            id: data.id,
            name: data.title,
            description: data.overview,
            image: data.backdrop_path || data.poster_path,
            year: data.release_date ? data.release_date.slice(0, 4) : '',
            genres: data.genres ? data.genres.map((g) => g.name) : [],
            actors: data.credits && data.credits.cast ? data.credits.cast.slice(0, 5).map((a) => a.name) : [],
          });
        });
    }
  }, [id, movie]);

  if (!movie) return <div style={{ color: '#fff' }}>Chargement...</div>;

  return (
    <Container>
      <div className="movie-header">
        <img
          className="movie-image"
          src={`https://image.tmdb.org/t/p/original${movie.image}`}
          alt={movie.name}
        />
        <div className="movie-info">
          <h1>{movie.name}</h1>
          <div className="movie-meta">
            <span>{movie.year}</span>
            {movie.genres && movie.genres.length > 0 && (
              <span> • {movie.genres.join(", ")}</span>
            )}
          </div>
          <p className="movie-description">{movie.description}</p>
          {movie.actors && movie.actors.length > 0 && (
            <div className="movie-actors">
              <b>Avec :</b> {movie.actors.join(", ")}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  color: #fff;
  min-height: 100vh;
  background: #111;
  .movie-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    .movie-image {
      width: 80vw;
      max-width: 900px;
      border-radius: 1rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 32px rgba(0,0,0,0.7);
    }
    .movie-info {
      max-width: 900px;
      text-align: left;
      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      .movie-meta {
        font-size: 1.1rem;
        color: #bbb;
        margin-bottom: 1rem;
      }
      .movie-description {
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }
      .movie-actors {
        font-size: 1.1rem;
        color: #ccc;
      }
    }
  }
`; 