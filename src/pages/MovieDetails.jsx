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
      <div className="title-box">
        <h1>{movie.name}</h1>
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
    top: 2.2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    gap: 2.2rem;
    background: rgba(15,15,15,0.92);
    border-radius: 2rem;
    padding: 0.35rem 1.5rem;
    z-index: 10;
    box-shadow: 0 2px 16px rgba(0,0,0,0.25);
    .nav-item {
      color: #fff;
      font-size: 1.08rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.18rem 1.1rem;
      border-radius: 2rem;
      transition: background 0.2s;
      &.selected, &:hover {
        background: #fff;
        color: #111;
      }
    }
  }
  .title-box {
    position: absolute;
    left: 0;
    bottom: 2.5rem;
    padding-left: 4vw;
    z-index: 5;
    h1 {
      font-size: 3.2rem;
      font-weight: 900;
      color: #fff;
      text-shadow: 0 4px 32px rgba(0,0,0,0.85), 0 1px 0 #000;
      margin: 0;
      letter-spacing: 0.04em;
    }
  }
`; 