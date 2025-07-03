import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { TMDB_BASE_URL, API_KEY } from "../utils/constants";

export default function MovieDetails() {
  const location = useLocation();
  const { id } = useParams();
  const [movie, setMovie] = useState(location.state?.movie || null);

  useEffect(() => {
    if (!movie) {
      axios
        .get(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`)
        .then(({ data }) => {
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
    <Container bgimg={movie.image ? `https://image.tmdb.org/t/p/original${movie.image}` : undefined}>
      <div className="navbar">
        <div className="nav-item selected">Bandes-annonces</div>
        <div className="nav-item">Autres titres à regarder</div>
        <div className="nav-item">Offres</div>
      </div>
      <div className="overlay">
        <div className="info-box">
          <h1>{movie.name}</h1>
          <div className="meta">
            <span>{movie.year}</span>
            {movie.genres && movie.genres.length > 0 && (
              <span> • {movie.genres.join(", ")}</span>
            )}
          </div>
          <p className="desc">{movie.description}</p>
          {movie.actors && movie.actors.length > 0 && (
            <div className="actors">
              <b>Avec :</b> {movie.actors.join(", ")}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${({ bgimg }) => bgimg ? `url(${bgimg}) center center/cover no-repeat` : '#111'};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    background: rgba(0,0,0,0.7);
    padding: 1.2rem 0 1.2rem 0;
    z-index: 10;
    .nav-item {
      color: #fff;
      font-size: 1.2rem;
      font-weight: 500;
      cursor: pointer;
      padding: 0.3rem 1.2rem;
      border-radius: 2rem;
      transition: background 0.2s;
      &.selected, &:hover {
        background: #fff;
        color: #111;
      }
    }
  }
  .overlay {
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(180deg,rgba(0,0,0,0.7) 60%,rgba(0,0,0,0.95) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 7rem;
    box-sizing: border-box;
  }
  .info-box {
    background: rgba(0,0,0,0.65);
    border-radius: 1.2rem;
    padding: 2.5rem 3rem;
    max-width: 600px;
    width: 100%;
    color: #fff;
    box-shadow: 0 4px 32px rgba(0,0,0,0.7);
    text-align: left;
    h1 {
      font-size: 2.7rem;
      font-weight: 800;
      margin-bottom: 1.2rem;
    }
    .meta {
      font-size: 1.1rem;
      color: #bbb;
      margin-bottom: 1.2rem;
    }
    .desc {
      font-size: 1.25rem;
      margin-bottom: 1.2rem;
    }
    .actors {
      font-size: 1.1rem;
      color: #ccc;
    }
  }
`; 