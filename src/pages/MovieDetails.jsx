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
  const [rawData, setRawData] = useState(null); // debug

  useEffect(() => {
    if (!movie) {
      axios
        .get(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`)
        .then(({ data }) => {
          setRawData(data); // debug
          setMovie({
            id: data.id,
            name: data.title || data.original_title || "Titre inconnu",
            description: data.overview || "Aucune description disponible.",
            image: data.backdrop_path || data.poster_path || null,
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
        {movie.image ? (
          <img
            className="movie-image"
            src={`https://image.tmdb.org/t/p/original${movie.image}`}
            alt={movie.name}
          />
        ) : (
          <div className="no-image">Aucune image disponible</div>
        )}
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
      {/* Debug temporaire pour voir les données TMDB */}
      {/* <pre style={{color:'#fff',fontSize:'0.8rem'}}>{JSON.stringify(rawData, null, 2)}</pre> */}
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
    .no-image {
      width: 80vw;
      max-width: 900px;
      height: 400px;
      background: #222;
      border-radius: 1rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #bbb;
      font-size: 1.5rem;
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