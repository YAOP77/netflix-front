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
        .get(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`)
        .then(({ data }) => {
          setMovie({
            id: data.id,
            name: data.title || data.original_title || "Titre inconnu",
            image: data.backdrop_path || data.poster_path || null,
            year: data.release_date ? data.release_date.slice(0, 4) : '',
            genres: data.genres ? data.genres.map((g) => g.name) : [],
            actors: data.credits && data.credits.cast ? data.credits.cast.slice(0, 5).map((a) => a.name) : [],
            description: data.overview || "Aucune description disponible.",
          });
          // Récupérer la bande-annonce YouTube
          const trailerVid = data.videos?.results?.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );
          if (trailerVid) {
            setTrailer({
              key: trailerVid.key,
              name: trailerVid.name,
              duration: null, // Optionnel, on peut l'ajouter si besoin
            });
          }
        });
    } else {
      // Si movie déjà là, on va chercher la vidéo
      axios
        .get(`${TMDB_BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`)
        .then(({ data }) => {
          const trailerVid = data.results?.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );
          if (trailerVid) {
            setTrailer({
              key: trailerVid.key,
              name: trailerVid.name,
              duration: null,
            });
          }
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
      <div className="content-sections">
        <div className="desc-cast-box">
          <div className="desc-title">{movie.name}</div>
          <div className="desc-meta">
            <span>{movie.year}</span>
            {movie.genres && movie.genres.length > 0 && (
              <span> • {movie.genres.join(", ")}</span>
            )}
            <span> • Drame</span> {/* Optionnel, à adapter selon le genre */}
          </div>
          <div className="desc-text">{movie.description}</div>
          {movie.actors && movie.actors.length > 0 && (
            <div className="desc-cast"><b>Avec :</b> {movie.actors.join(", ")}</div>
          )}
        </div>
        <div className="trailer-section">
          <div className="trailer-title">Bandes-annonces</div>
          {trailer ? (
            <div className="trailer-thumb-box">
              {!showTrailer ? (
                <div className="trailer-thumb" onClick={() => setShowTrailer(true)}>
                  <img
                    src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                    alt="Bande-annonce"
                  />
                  <div className="play-btn">
                    <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#000" fillOpacity="0.6"/><polygon points="20,16 36,24 20,32" fill="#fff"/></svg>
                  </div>
                  <div className="trailer-caption">
                    <div className="trailer-label">BANDE-ANNONCE</div>
                    <div className="trailer-name">Bande-annonce : {movie.name}</div>
                  </div>
                </div>
              ) : (
                <div className="trailer-player">
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="trailer-thumb-box">Aucune bande-annonce trouvée.</div>
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
    z-index: 10;
    box-shadow: 0 2px 16px rgba(0,0,0,0.25);
    min-width: 420px;
    max-width: 540px;
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
  .content-sections {
    margin-top: 38vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    z-index: 20;
  }
  .desc-cast-box {
    background: rgba(30,30,30,0.92);
    border-radius: 1.2rem;
    padding: 2rem 2.5rem 2rem 2.5rem;
    max-width: 900px;
    width: 90vw;
    color: #fff;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
    .desc-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.7rem;
    }
    .desc-meta {
      font-size: 1.1rem;
      color: #bbb;
      margin-bottom: 1.1rem;
    }
    .desc-text {
      font-size: 1.18rem;
      margin-bottom: 1.1rem;
    }
    .desc-cast {
      font-size: 1.1rem;
      color: #ccc;
    }
  }
  .trailer-section {
    width: 90vw;
    max-width: 900px;
    background: rgba(30,30,30,0.92);
    border-radius: 1.2rem;
    padding: 2rem 2.5rem 2.5rem 2.5rem;
    color: #fff;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
    .trailer-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1.2rem;
    }
    .trailer-thumb-box {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .trailer-thumb {
        position: relative;
        width: 320px;
        height: 180px;
        border-radius: 0.7rem;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 2px 16px rgba(0,0,0,0.18);
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .play-btn {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .trailer-caption {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          background: rgba(0,0,0,0.7);
          color: #fff;
          padding: 0.5rem 1rem;
          .trailer-label {
            font-size: 0.95rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            opacity: 0.85;
          }
          .trailer-name {
            font-size: 1.1rem;
            font-weight: 500;
            margin-top: 0.2rem;
          }
        }
      }
      .trailer-player {
        width: 100%;
        max-width: 560px;
        margin-top: 1rem;
        iframe {
          width: 100%;
          height: 315px;
          border-radius: 0.7rem;
        }
      }
    }
  }
`; 