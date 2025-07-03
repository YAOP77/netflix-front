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
  const [showModal, setShowModal] = useState(false);

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
    <Container>
      {/* Section 1 : Image + Navbar + Titre */}
      <div className="section1" style={{ backgroundImage: movie.image ? `url(https://image.tmdb.org/t/p/original${movie.image})` : undefined }}>
        <div className="navbar">
          <div className="nav-item selected">Bandes-annonces</div>
          <div className="nav-item">Autres titres à regarder</div>
          <div className="nav-item">Offres</div>
        </div>
        <div className="title-box">
          <div className="title-bg"><h1>{movie.name}</h1></div>
        </div>
        <div className="fade-bottom" />
      </div>
      {/* Section 2 : Vidéo + Description côte à côte, sur fond noir */}
      <div className="section2">
        <div className="row-flex">
          <div className="trailer-section">
            <div className="trailer-title">Bandes-annonces</div>
            {trailer ? (
              <div className="trailer-card">
                <div className="trailer-thumb" onClick={() => setShowModal(true)}>
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
          </div>
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
        </div>
      </div>
      {/* Popup modal pour la vidéo */}
      {showModal && trailer && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <iframe
              width="800"
              height="450"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;

  .section1 {
    min-height: 75vh;
    width: 100vw;
    background: #111;
    background-size: cover;
    background-position: center center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .navbar {
      position: absolute;
      top: 2.2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      gap: 0.7rem;
      background: rgba(15,15,15,0.92);
      border-radius: 2rem;
      padding: 0.12rem 0.5rem;
      z-index: 10;
      box-shadow: 0 2px 16px rgba(0,0,0,0.18);
      min-width: 260px;
      max-width: 340px;
      .nav-item {
        color: #fff;
        font-size: 0.93rem;
        font-weight: 600;
        cursor: pointer;
        padding: 0.07rem 0.5rem;
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
      bottom: 2.7rem;
      padding-left: 4vw;
      z-index: 5;
      .title-bg {
        display: inline-block;
        background: rgba(0,0,0,0.55);
        border-radius: 0.5rem;
        padding: 0.2em 1.2em 0.2em 0.5em;
        box-shadow: 0 4px 32px rgba(0,0,0,0.45);
      }
      h1 {
        font-size: 3.3rem;
        font-weight: 900;
        color: #fff;
        text-shadow: 0 4px 32px rgba(0,0,0,0.95), 0 1px 0 #000;
        margin: 0;
        letter-spacing: 0.04em;
      }
    }
    .fade-bottom {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100vw;
      height: 8vh;
      background: linear-gradient(180deg,rgba(0,0,0,0.01) 0%,rgba(0,0,0,0.85) 100%);
      z-index: 2;
    }
  }
  .section2 {
    background: #111;
    margin-top: 0;
    padding-top: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    padding-left: 2vw;
    padding-right: 2vw;
    padding-bottom: 4vw;
    z-index: 20;
    @media (max-width: 900px) {
      padding-top: 1.2rem;
      padding-left: 1vw;
      padding-right: 1vw;
      padding-bottom: 2vw;
    }
    .row-flex {
      display: flex;
      flex-direction: row;
      gap: 2.5rem;
      width: 100%;
      max-width: 1100px;
      align-items: flex-start;
      justify-content: center;
      @media (max-width: 900px) {
        flex-direction: column;
        gap: 1.5rem;
        align-items: stretch;
      }
    }
  }
  .desc-card {
    background: rgba(30,30,30,0.82);
    border-radius: 1.2rem;
    padding: 2rem 2.5rem;
    max-width: 600px;
    width: 100%;
    color: #fff;
    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    margin-bottom: 1.5rem;
    backdrop-filter: blur(6px);
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
      line-height: 1.6;
      letter-spacing: 0.01em;
    }
  }
  .trailer-section {
    margin-top: 1.5rem;
    min-width: 280px;
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
  }
  .modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.85);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    .modal-content {
      position: relative;
      background: transparent;
      border-radius: 1.2rem;
      box-shadow: 0 4px 32px rgba(0,0,0,0.45);
      padding: 0;
      iframe {
        width: 80vw;
        max-width: 900px;
        height: 45vw;
        max-height: 60vh;
        border-radius: 1rem;
        background: #000;
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