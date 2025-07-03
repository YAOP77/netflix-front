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
            description: data.overview || "Aucune description disponible.",
          });
        });
    }
    // Récupérer la bande-annonce
    axios
      .get(`${TMDB_BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`)
      .then(({ data }) => {
        const trailerVid = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailerVid) {
          setTrailer(trailerVid);
        }
      });
  }, [id, movie]);

  if (!movie) return <div style={{ color: '#fff' }}>Chargement...</div>;

  return (
    <Container bgimg={movie.image ? `https://image.tmdb.org/t/p/original${movie.image}` : undefined}>
      {/* Section 1 : Image + Navbar + Titre */}
      <div className="navbar">
        <div className="nav-item selected">Bandes-annonces</div>
        <div className="nav-item">Autres titres à regarder</div>
        <div className="nav-item">Offres</div>
      </div>
      <div className="title-box">
        <h1>{movie.name}</h1>
      </div>
      {/* Section 2 : Description + Bande-annonce */}
      <div className="section2">
        <div className="desc-card">
          <div className="desc-header">
            <div>
              <span className="desc-title">{movie.name}</span>
              <span className="desc-meta">{movie.year} • {movie.genres.join(", ")}</span>
            </div>
            {movie.actors && movie.actors.length > 0 && (
              <div className="desc-actors"><b>Avec :</b> {movie.actors.join(", ")}</div>
            )}
          </div>
          <div className="desc-body">{movie.description}</div>
        </div>
        <div className="trailer-section">
          <div className="trailer-title">Bandes-annonces</div>
          {trailer ? (
            <div className="trailer-card">
              <div className="trailer-thumb" onClick={() => setTrailer({ ...trailer, show: true })}>
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                  alt="Bande-annonce"
                />
                <div className="play-btn">▶</div>
                <div className="trailer-duration">1 m 44 s</div>
              </div>
              <div className="trailer-info">
                <div className="trailer-label">BANDE-ANNONCE</div>
                <div className="trailer-name">Bande-annonce : {movie.name}</div>
              </div>
            </div>
          ) : (
            <div style={{ color: '#bbb', marginTop: '1.5rem' }}>Aucune bande-annonce trouvée.</div>
          )}
          {/* Affichage de la vidéo dans une modal ou en dessous */}
          {trailer && trailer.show && (
            <div className="trailer-modal">
              <iframe
                width="640"
                height="360"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button className="close-btn" onClick={() => setTrailer({ ...trailer, show: false })}>✕</button>
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
    gap: 1.5rem;
    background: rgba(15,15,15,0.92);
    border-radius: 2rem;
    padding: 0.25rem 1.2rem;
    z-index: 10;
    box-shadow: 0 2px 16px rgba(0,0,0,0.25);
    min-width: 420px;
    max-width: 520px;
    .nav-item {
      color: #fff;
      font-size: 1.05rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.13rem 0.9rem;
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
  .section2 {
    margin-top: 60vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2.5rem;
    padding: 0 8vw 4vw 8vw;
    z-index: 20;
  }
  .desc-card {
    background: rgba(30,30,30,0.92);
    border-radius: 1.2rem;
    padding: 2rem 2.5rem;
    max-width: 900px;
    width: 100%;
    color: #fff;
    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    margin-bottom: 1.5rem;
    .desc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      .desc-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        display: block;
      }
      .desc-meta {
        font-size: 1.1rem;
        color: #bbb;
        margin-left: 0.5rem;
      }
      .desc-actors {
        font-size: 1.1rem;
        color: #ccc;
        min-width: 200px;
        text-align: right;
      }
    }
    .desc-body {
      font-size: 1.15rem;
      margin-top: 1.2rem;
      color: #eee;
    }
  }
  .trailer-section {
    margin-top: 1.5rem;
    .trailer-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.2rem;
      color: #fff;
    }
    .trailer-card {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      .trailer-thumb {
        position: relative;
        width: 260px;
        height: 146px;
        border-radius: 0.7rem;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 2px 16px rgba(0,0,0,0.25);
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
          font-size: 2.7rem;
          color: #fff;
          background: rgba(0,0,0,0.55);
          border-radius: 50%;
          padding: 0.2em 0.35em;
          pointer-events: none;
        }
        .trailer-duration {
          position: absolute;
          right: 0.7rem;
          bottom: 0.7rem;
          background: rgba(0,0,0,0.7);
          color: #fff;
          font-size: 1rem;
          padding: 0.15em 0.7em;
          border-radius: 0.7em;
        }
      }
      .trailer-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .trailer-label {
          font-size: 1rem;
          color: #bbb;
          font-weight: 600;
          margin-bottom: 0.3rem;
        }
        .trailer-name {
          font-size: 1.1rem;
          color: #fff;
          font-weight: 600;
        }
      }
    }
    .trailer-modal {
      margin-top: 1.5rem;
      position: relative;
      width: 640px;
      max-width: 90vw;
      iframe {
        width: 100%;
        height: 360px;
        border-radius: 1rem;
        box-shadow: 0 4px 32px rgba(0,0,0,0.45);
      }
      .close-btn {
        position: absolute;
        top: -2.2rem;
        right: 0;
        background: #111;
        color: #fff;
        border: none;
        font-size: 2rem;
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      }
    }
  }
`; 