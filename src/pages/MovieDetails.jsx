import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { TMDB_BASE_URL, API_KEY } from "../utils/constants";

export default function MovieDetails() {
  const location = useLocation();
  const { id } = useParams();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

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

  useEffect(() => {
    // Récupérer la bande-annonce YouTube
    if (movie && !trailer) {
      axios
        .get(`${TMDB_BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`)
        .then(({ data }) => {
          const t = data.results.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );
          if (t) setTrailer(t);
        });
    }
  }, [movie, trailer]);

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
      <div className="details-section">
        <div className="desc-card">
          <div className="desc-header">
            <span className="desc-title">{movie.name}</span>
            <span className="desc-meta">{movie.year} • {movie.genres.join(", ")} • Drame</span>
            {movie.actors && movie.actors.length > 0 && (
              <span className="desc-actors"><b>Avec :</b> {movie.actors.join(", ")}</span>
            )}
          </div>
          <div className="desc-body">{movie.description}</div>
        </div>
        <div className="trailer-section">
          <h2>Bandes-annonces</h2>
          {trailer ? (
            <div className="trailer-thumb" onClick={() => setShowTrailer(true)}>
              <img
                src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                alt="Bande-annonce"
              />
              <div className="play-btn">
                <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#000" fillOpacity="0.6"/><polygon points="20,16 34,24 20,32" fill="#fff"/></svg>
              </div>
              <div className="trailer-duration">1 m 44 s</div>
              <div className="trailer-caption">BANDE-ANNONCE<br/>Bande-annonce : {movie.name}</div>
            </div>
          ) : (
            <div style={{ color: '#fff', marginTop: '1rem' }}>Aucune bande-annonce trouvée.</div>
          )}
          {showTrailer && trailer && (
            <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
              <iframe
                width="800"
                height="450"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
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
    top: 2.2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    gap: 2.2rem;
    background: rgba(15,15,15,0.92);
    border-radius: 2rem;
    padding: 0.35rem 2.5rem;
    min-width: 420px;
    max-width: 520px;
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
  .details-section {
    margin-top: 60vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2.5rem;
    padding: 0 2vw 4vw 2vw;
    z-index: 20;
  }
  .desc-card {
    background: rgba(30,30,30,0.92);
    border-radius: 1.2rem;
    padding: 2rem 2.5rem 1.5rem 2.5rem;
    max-width: 900px;
    margin: 0 auto 0.5rem auto;
    color: #fff;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
    .desc-header {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      gap: 2rem;
      flex-wrap: wrap;
      .desc-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .desc-meta {
        font-size: 1.1rem;
        color: #bbb;
        margin-bottom: 0.5rem;
      }
      .desc-actors {
        font-size: 1.1rem;
        color: #ccc;
        margin-bottom: 0.5rem;
      }
    }
    .desc-body {
      font-size: 1.18rem;
      margin-top: 0.5rem;
    }
  }
  .trailer-section {
    margin-top: 1.5rem;
    h2 {
      color: #fff;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.2rem;
    }
    .trailer-thumb {
      position: relative;
      width: 320px;
      height: 180px;
      border-radius: 0.8rem;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 2px 16px rgba(0,0,0,0.18);
      margin-bottom: 0.7rem;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .play-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
        pointer-events: none;
      }
      .trailer-duration {
        position: absolute;
        right: 0.7rem;
        bottom: 0.7rem;
        background: rgba(0,0,0,0.7);
        color: #fff;
        font-size: 1rem;
        padding: 0.2rem 0.7rem;
        border-radius: 0.5rem;
        z-index: 2;
      }
      .trailer-caption {
        position: absolute;
        left: 0.7rem;
        bottom: 0.7rem;
        color: #fff;
        font-size: 0.95rem;
        font-weight: 600;
        text-shadow: 0 2px 8px #000;
        z-index: 2;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }
    }
    .trailer-modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      iframe {
        border-radius: 1.2rem;
        box-shadow: 0 2px 32px #000;
      }
    }
  }
`; 