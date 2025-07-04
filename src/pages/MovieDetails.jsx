import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TMDB_BASE_URL, API_KEY } from "../utils/constants";
import Card from "../components/Card";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const NAV_TABS = [
  { key: "trailer", label: "Bandes-annonces" },
  { key: "other", label: "Autres titres à regarder" },
  { key: "offers", label: "Offres" },
  { key: "episode", label: "Episode" },
];

// Mapping nom de genre (français) -> ID TMDB
const GENRE_NAME_TO_ID = {
  "Action": 28,
  "Aventure": 12,
  "Animation": 16,
  "Comédie": 35,
  "Crime": 80,
  "Documentaire": 99,
  "Drame": 18,
  "Familial": 10751,
  "Fantastique": 14,
  "Histoire": 36,
  "Horreur": 27,
  "Musique": 10402,
  "Mystère": 9648,
  "Romance": 10749,
  "Science-Fiction": 878,
  "Téléfilm": 10770,
  "Thriller": 53,
  "Guerre": 10752,
  "Western": 37
};

export default function MovieDetails() {
  const location = useLocation();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("trailer");
  const episodesRef = useRef(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const offerRef = useRef(null);
  const navigate = useNavigate();
  const similarRef = useRef(null);

  useEffect(() => {
    // Toujours recharger le film quand l'id change
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
          runtime: data.runtime,
          countries: data.production_countries ? data.production_countries.map(c => c.name) : [],
          spoken_languages: data.spoken_languages ? data.spoken_languages.map(l => l.english_name) : [],
          original_language: data.original_language,
          vote_average: data.vote_average,
          status: data.status,
        });
      });
    // Récupérer la bande-annonce
    axios
      .get(`${TMDB_BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`)
      .then(({ data }) => {
        const trailerVid = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailerVid) {
          setTrailer(trailerVid);
        } else {
          setTrailer(null);
        }
      });
  }, [id]);

  // Génère dynamiquement des épisodes pour chaque film
  function getSimulatedEpisodes(movie) {
    if (!movie) return [];
    const mainImage = movie.image
      ? `https://image.tmdb.org/t/p/original${movie.image}`
      : "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80";
    // Titres variés
    const episodeTitles = [
      `Le secret de ${movie.name.split(' ')[0]}`,
      `Face à l'inconnu` ,
      `La revanche de ${movie.name.split(' ')[0]}`
    ];
    // Descriptions immersives
    const episodeDescs = [
      `Dans ce premier épisode, ${movie.name} découvre un secret qui va bouleverser sa vie. Entre doutes et révélations, il/elle devra faire face à ses peurs les plus profondes.`,
      `Alors que la tension monte, un nouvel ennemi surgit de l'ombre. ${movie.name} et ses alliés devront s'unir pour affronter une menace inattendue, au péril de leur existence.`,
      `L'heure de la revanche a sonné. Après de multiples épreuves, ${movie.name} prend une décision radicale qui changera le cours de l'histoire. Mais à quel prix ?`
    ];
    // Effets CSS pour simuler des "captures" différentes
    const imageEffects = [
      '', // normal
      'zoom', // zoom/crop
      'bw', // noir et blanc
    ];
    return [1,2,3].map((num, idx) => {
      const duration = 40 + Math.floor(Math.random()*20); // 40-59 min
      return {
        id: num,
        title: episodeTitles[idx % episodeTitles.length],
        duration,
        description: episodeDescs[idx % episodeDescs.length],
        image: mainImage,
        effect: imageEffects[idx % imageEffects.length],
      };
    });
  }

  // Remplace la génération de fakeEpisodes par :
  const fakeEpisodes = getSimulatedEpisodes(movie);

  useEffect(() => {
    if (activeTab === "episode" && episodesRef.current) {
      episodesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (activeTab === "other" && similarRef.current) {
      similarRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (activeTab === "offers" && offerRef.current) {
      offerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeTab]);

  // Récupère des films similaires (même genre) via TMDB
  const fetchSimilarMovies = useCallback(async () => {
    if (!movie || !movie.genres || movie.genres.length === 0) return;
    try {
      // Prend le premier genre du film sélectionné
      const genreName = movie.genres[0];
      const genreId = GENRE_NAME_TO_ID[genreName] || null;
      let res;
      if (genreId) {
        res = await axios.get(`${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=fr-FR`);
      } else {
        // Fallback : films populaires
        res = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`);
      }
      // Filtre pour ne pas inclure le film courant
      const filtered = res.data.results.filter(m => m.id !== movie.id).slice(0, 6);
      setSimilarMovies(filtered.map(m => ({
        id: m.id,
        name: m.title || m.original_title,
        image: m.backdrop_path || m.poster_path,
        genres: m.genre_ids || [],
      })));
    } catch (e) {
      setSimilarMovies([]);
    }
  }, [movie]);

  useEffect(() => {
    fetchSimilarMovies();
  }, [fetchSimilarMovies]);

  // Scroll vers l'offre si on clique sur un épisode
  const handleEpisodeClick = useCallback(() => {
    if (offerRef.current) {
      offerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  if (!movie) return <div style={{ color: '#fff' }}>Chargement...</div>;

  return (
    <Container>
      {/* Fond global flouté */}
      {movie.image && (
        <div
          className="blur-bg"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.image})`,
          }}
        />
      )}
      {/* Section 1 : Image + Navbar + Titre */}
      <div
        className="section1"
        style={{
          "--section1-bg": movie.image ? `url(https://image.tmdb.org/t/p/original${movie.image})` : "none",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="navbar-floating">
          <div className="navbar-tabs">
            {NAV_TABS.map((tab, idx) => (
              <button
                key={tab.key}
                className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
                style={{ zIndex: 2 }}
              >
                {tab.label}
              </button>
            ))}
            {/*
            <div
              className="tab-slider"
              style={{
                left: `calc(${NAV_TABS.findIndex(t => t.key === activeTab)} * (100% / ${NAV_TABS.length}))`,
                width: `calc(100% / ${NAV_TABS.length})`,
              }}
            />
            */}
          </div>
        </div>
        <div className="title-box">
          <div className="title-bg"><h1>{movie.name}</h1></div>
        </div>
        <div className="fade-bottom" />
      </div>
      {/* Section 2 : Vidéo + Description + Episodes */}
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
            <div className="desc-infos" style={{marginTop:'0.7em',marginBottom:'0.7em',fontSize:'1em',color:'#bbb',display:'flex',flexWrap:'wrap',gap:'1.5em'}}>
              {movie.runtime && <span>Durée : {movie.runtime} min</span>}
              {movie.countries && movie.countries.length > 0 && <span>Pays : {movie.countries.join(", ")}</span>}
              {movie.spoken_languages && movie.spoken_languages.length > 0 && <span>Langues : {movie.spoken_languages.join(", ")}</span>}
              {movie.vote_average && <span>Note : {movie.vote_average}/10</span>}
              {movie.status && <span>Statut : {movie.status}</span>}
            </div>
            <div className="desc-body">{movie.description}</div>
          </div>
        </div>
        {/* Partie Episodes dans la section2 */}
        <div ref={episodesRef} className="episodes-section" style={{marginTop:'2.5rem', display: activeTab === 'episode' ? 'block' : 'none'}}>
          <h2 className="episodes-title">Épisodes</h2>
          <div className="episodes-list">
            {fakeEpisodes.map((ep, idx) => (
              <div className="episode-card episode-clickable" key={ep.id} onClick={handleEpisodeClick} style={{cursor:'pointer'}}>
                <div className="episode-image-container">
                  <img src={ep.image} alt={ep.title} className={`episode-image${ep.effect ? ' effect-' + ep.effect : ''}`} />
                  <span className="episode-duration">{ep.duration} m</span>
                </div>
                <div className="episode-info">
                  <div className="episode-title"><b>{idx+1}. {ep.title}</b></div>
                  <div className="episode-desc">{ep.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Section 3 : Plus de détails */}
      <div className="section3">
        <h2 className="details-title">Plus de détails</h2>
        <div className="details-grid">
          <div className="details-card">
            <div><b>Lecture hors ligne</b></div>
            <div>Téléchargeable</div>
            <br />
            <div><b>Genres</b></div>
            <div>{movie.genres.join(", ")}</div>
            <br />
            <div><b>Cette série est…</b></div>
            <div>
              Sombre, À suspense, Thriller, À rebondissements, Contre le système, Film hollywoodien, Émouvant, Enjeux sociaux, Drame
            </div>
            <br />
            <div><b>À propos de À bout</b></div>
            <div>
              Découvrez les coulisses et apprenez-en plus sur <a href="https://www.tudum.com" target="_blank" rel="noopener noreferrer" style={{color:'#fff',textDecoration:'underline'}}>Tudum.com</a>
            </div>
          </div>
          <div className="details-card">
            <div><b>Audio</b></div>
            <div>anglais - Audiodescription, anglais [VO], français - Audiodescription, français</div>
            <br />
            <div><b>Sous-titres</b></div>
            <div>anglais, français</div>
          </div>
          <div className="details-card">
            <div><b>Distribution</b></div>
            <div>
              {movie.actors && movie.actors.length > 0
                ? movie.actors.join(", ")
                : "Non renseigné"}
            </div>
          </div>
        </div>
      </div>
      {/* Section 4 : Vous aimerez peut-être aussi */}
      <div className="similar-section" ref={similarRef}>
        <div
          className="similar-arrow left"
          onClick={() => {
            const list = document.querySelector('.similar-list');
            if (list) list.scrollBy({ left: -180, behavior: 'smooth' });
          }}
        >
          <AiOutlineLeft />
        </div>
        <div className="similar-title-bg">
          <h2 className="similar-title">Vous aimerez peut-être aussi</h2>
        </div>
        <div
          className="similar-arrow right"
          onClick={() => {
            const list = document.querySelector('.similar-list');
            if (list) list.scrollBy({ left: 180, behavior: 'smooth' });
          }}
        >
          <AiOutlineRight />
        </div>
        <div className="similar-list">
          {similarMovies.length === 0 ? (
            <div style={{color:'#fff',fontSize:'1.3rem',margin:'2.5rem auto',textAlign:'center'}}>Aucun film similaire trouvé.</div>
          ) : similarMovies.map((m, idx) => (
            <div
              className="similar-card-wrapper"
              key={m.id}
              style={{cursor:'pointer'}}
              onClick={() => navigate(`/movie/${m.id}`, { state: { movie: m } })}
            >
              <Card movieData={m} />
            </div>
          ))}
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
      {/* Section 5 : Offres d'abonnement */}
      <div ref={offerRef} className="offers-section" z-index={10}>
        <div className="offers-title-bg" z-index={20}>
          <h2 className="offers-title">Une offre qui répond à vos besoins</h2>
        </div>
        <div className="offers-list">
          {[
            { key: 'mobile', label: 'Mobile', quality: '480p', desc: ['Qualité vidéo normale', 'Pour votre téléphone ou tablette'], price: '2500 FCFA/mois', color: 'linear-gradient(135deg,#23243a 0%,#2b2b3c 100%)' },
            { key: 'essentiel', label: 'Essentiel', quality: '720p', desc: ['Bonne qualité vidéo', 'Pour votre téléphone, tablette, ordinateur et TV'], price: '5000 FCFA/mois', color: 'linear-gradient(135deg,#1e2a47 0%,#2b3c5c 100%)' },
            { key: 'standard', label: 'Standard', quality: '1080p', desc: ['Excellente qualité vidéo', 'Pour votre téléphone, tablette, ordinateur et TV'], price: '10 000 FCFA/mois', color: 'linear-gradient(135deg,#2a1e47 0%,#5c2b3c 100%)' },
            { key: 'premium', label: 'Premium', quality: '4K + HDR', desc: ['Qualité vidéo optimale', 'Un son immersif (audio spatial)', 'Pour votre téléphone, tablette, ordinateur et TV'], price: '20 500 FCFA/mois', color: 'linear-gradient(135deg,#4a1e47 0%,#7c2b5c 100%)', popular: true },
          ].map((offer, idx) => (
            <div
              key={offer.key}
              className={`offer-card${selectedOffer === offer.key ? ' offer-selected' : ''}${offer.popular ? ' offer-popular' : ''}`}
              style={{ background: offer.color, border: selectedOffer === offer.key ? '2.5px solid #fff' : '1.5px solid #888' }}
              onClick={() => setSelectedOffer(offer.key)}
            >
              {offer.popular && <div className="offer-popular-badge">La plus populaire</div>}
              <div className="offer-label">{offer.label}</div>
              <div className="offer-quality">{offer.quality}</div>
              <ul className="offer-desc">
                {offer.desc.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
              <div className="offer-price">{offer.price}</div>
            </div>
          ))}
        </div>
      </div>
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

  .blur-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    background-size: cover;
    background-position: center;
    filter: blur(38px) brightness(0.7);
    pointer-events: none;
    transition: background-image 0.4s;
  }
  .section1, .section2, .section3 {
    position: relative;
  }
  .section1 {
    background: #111;
    background-image: var(--section1-bg);
    background-size: cover;
    background-position: center center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 75vh;
    width: 100vw;
    .navbar-floating {
      position: fixed;
      top: 2.2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999 !important;
      display: flex;
      justify-content: center;
      min-width: 320px;
      width: auto;
      max-width: 98vw;
      box-shadow: 0 6px 32px 0 rgba(0,0,0,0.38), 0 1.5px 8px 0 rgba(0,0,0,0.18) !important;
      .navbar-tabs {
        position: relative;
        display: flex;
        width: auto;
        min-width: 320px;
        background: rgba(15,15,15,0.92);
        border-radius: 2rem;
        box-shadow: 0 2px 16px rgba(0,0,0,0.18);
        overflow: hidden;
        height: 40px;
        align-items: center;
        padding: 0 0.5rem;
        gap: 0.2rem;
        .tab-btn {
          flex: 1 1 0;
          background: none;
          border: none;
          outline: none;
          color: #fff;
          font-size: 0.7em;
          font-weight: 700;
          cursor: pointer;
          padding: 0 1.2em;
          height: 36px;
          border-radius: 1.5em;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: color 0.2s, background 0.18s;
          letter-spacing: 0.01em;
        }
        .tab-btn.active {
          color: #111;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        }
        .tab-slider {
          display: none;
        }
      }
      @media (max-width: 600px) {
        min-width: 0;
        width: 98vw;
        .navbar-tabs {
          min-width: 0;
          width: 98vw;
          .tab-btn {
            font-size: 0.7em;
            padding: 0 0.7em;
            height: 32px;
          }
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
      box-shadow: 0 12px 48px 0 rgba(0,0,0,0.55), 0 1.5px 8px 0 rgba(0,0,0,0.18) !important;
    }
  }
  .section2 {
    background: transparent !important;
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
    .desc-infos {
      margin-top: 0.7em;
      margin-bottom: 0.7em;
      font-size: 1em;
      color: #bbb;
      display: flex;
      flex-wrap: wrap;
      gap: 1.5em;
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
  .section3 {
    background: transparent !important;
    padding: 2.5rem 0 3.5rem 0;
    color: #fff;
    .details-title {
      font-size: 2rem;
      font-weight: bold;
      margin-left: 2.5rem;
      margin-bottom: 2.2rem;
    }
    .details-grid {
      display: flex;
      gap: 2.5rem;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: wrap;
      @media (max-width: 900px) {
        flex-direction: column;
        gap: 1.5rem;
        align-items: stretch;
      }
    }
    .details-card {
      background: rgba(30,30,30,0.82);
      border-radius: 1.2rem;
      box-shadow: 0 2px 16px rgba(0,0,0,0.18);
      padding: 2rem 1.5rem 1.5rem 1.5rem;
      min-width: 300px;
      max-width: 370px;
      font-size: 1.05rem;
      line-height: 1.6;
      a { color: #fff; text-decoration: underline; }
    }
  }
  .desc-card, .trailer-card, .details-card {
    background: rgba(30,30,30,0.48) !important;
    border-radius: 1.2rem;
    padding: 2rem 2.5rem;
    max-width: 600px;
    width: 100%;
    color: #fff;
    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    margin-bottom: 1.5rem;
    backdrop-filter: blur(6px);
  }
  .episodes-section {
    margin: 2.5rem 0 3.5rem 0;
    color: #fff;
    .episodes-title {
      font-size: 2.2rem;
      font-weight: bold;
      margin-left: 2.5rem;
      margin-bottom: 2.2rem;
    }
    .episodes-list {
      display: flex;
      flex-direction: row;
      gap: 2.2rem;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: wrap;
      padding: 0 2.5rem;
      @media (max-width: 900px) {
        flex-direction: column;
        gap: 1.5rem;
        padding: 0 0.5rem;
      }
    }
    .episode-card {
      background: rgba(30,30,30,0.48) !important;
      border-radius: 1.2rem;
      box-shadow: 0 2px 16px rgba(0,0,0,0.18);
      padding: 0 0 1.2rem 0;
      min-width: 320px;
      max-width: 370px;
      font-size: 1.05rem;
      line-height: 1.6;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      overflow: hidden;
      backdrop-filter: blur(6px);
      .episode-image-container {
        position: relative;
        width: 100%;
        height: 170px;
        overflow: hidden;
        border-top-left-radius: 1.2rem;
        border-top-right-radius: 1.2rem;
        .episode-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .episode-image.effect-zoom {
          transform: scale(1.18) translateY(6%);
          object-position: center 30%;
        }
        .episode-image.effect-bw {
          filter: grayscale(1) contrast(1.1);
        }
        .episode-duration {
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
      .episode-info {
        padding: 1.1rem 1.2rem 0 1.2rem;
        .episode-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .episode-desc {
          font-size: 1rem;
          color: #ddd;
        }
      }
    }
  }
  .similar-section {
    margin: 3.5rem 0 4.5rem 0;
    color: #fff;
    padding: 2.5rem 0 2.5rem 0;
    position: relative;
    &:hover .similar-arrow {
      opacity: 1;
      pointer-events: auto;
    }
    .similar-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 38px;
      height: 88px;
      background: rgba(60,60,60,0.32);
      border-radius: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 12px rgba(0,0,0,0.18);
      transition: background 0.18s, box-shadow 0.18s, opacity 0.18s;
      cursor: pointer;
      border: none;
      padding: 0;
      opacity: 0;
      pointer-events: none;
      z-index: 30;
      svg {
        color: #fff;
        font-size: 2.1rem;
        transition: color 0.18s;
      }
      &:hover {
        background: rgba(120,120,120,0.44);
        box-shadow: 0 4px 18px rgba(0,0,0,0.28);
        opacity: 1;
        svg {
          color: #fff;
        }
      }
    }
    .similar-arrow.left {
      left: 0.5rem;
    }
    .similar-arrow.right {
      right: 0.5rem;
    }
    .similar-title-bg {
      position: relative;
      z-index: 20;
      display: flex;
      align-items: center;
      margin-left: 2.5rem;
      margin-bottom: 1.7rem;
      margin-top: 0.5rem;
      background: rgba(20,20,20,0.55);
      border-radius: 1.5rem;
      box-shadow: 0 4px 32px rgba(0,0,0,0.45);
      padding: 0.5rem 2.2rem;
      width: fit-content;
    }
    .similar-title {
      font-size: 2.4rem;
      font-weight: 900;
      color: #fff;
      text-shadow: 0 4px 32px rgba(0,0,0,0.95), 0 1px 0 #000;
      letter-spacing: 0.01em;
      margin: 0;
      padding: 0;
      line-height: 1.1;
    }
    .similar-list {
      display: flex;
      flex-direction: row;
      gap: 1.5rem;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: nowrap;
      padding: 0 2.5rem;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .similar-card-wrapper {
        min-width: 140px;
        max-width: 140px;
        width: 140px;
        aspect-ratio: 2/3;
        margin: 0 0.3rem;
        display: flex;
        align-items: stretch;
      }
      .card-image-container {
        width: 100% !important;
        min-width: 100% !important;
        max-width: 100% !important;
        aspect-ratio: 2/3;
      }
    }
    .similar-list > div[style] {
      color: #fff !important;
      font-size: 1.3rem !important;
      text-align: center;
      margin: 2.5rem auto !important;
      text-shadow: 0 2px 8px rgba(0,0,0,0.45);
    }
  }
  .offers-section {
    z-index: 10;
    margin: 4.5rem 0 2.5rem 0;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .offers-title-bg {
      position: relative;
      z-index: 20;
      display: flex;
      align-items: center;
      margin-left: 2.5rem;
      margin-bottom: 1.7rem;
      margin-top: 0.5rem;
      background: rgba(20,20,20,0.55);
      border-radius: 1.5rem;
      box-shadow: 0 4px 32px rgba(0,0,0,0.45);
      padding: 0.5rem 2.2rem;
      width: fit-content;
    }
    .offers-title {
      font-size: 2.3rem;
      font-weight: 900;
      color: #fff;
      text-shadow: 0 4px 32px rgba(0,0,0,0.95), 0 1px 0 #000;
      letter-spacing: 0.01em;
      margin: 0;
      padding: 0;
      line-height: 1.1;
    }
    .offers-list {
      display: flex;
      flex-direction: row;
      gap: 2.2rem;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: wrap;
      padding: 0 2.5rem;
      width: 100%;
      @media (max-width: 900px) {
        flex-direction: column;
        gap: 1.5rem;
        padding: 0 0.5rem;
      }
    }
    .offer-card {
      min-width: 220px;
      max-width: 260px;
      width: 100%;
      border-radius: 1.2rem;
      box-shadow: 0 2px 16px rgba(0,0,0,0.18);
      padding: 2.2rem 1.5rem 1.5rem 1.5rem;
      font-size: 1.05rem;
      line-height: 1.6;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;
      cursor: pointer;
      transition: border 0.18s, box-shadow 0.18s, background 0.18s;
      border: 1.5px solid #888;
      &:hover, &.offer-selected {
        border: 2.5px solid #fff;
        box-shadow: 0 6px 32px 0 rgba(0,0,0,0.38), 0 1.5px 8px 0 rgba(0,0,0,0.18);
        background: linear-gradient(135deg,#2b2b3c 0%,#4a1e47 100%) !important;
      }
      &.offer-popular {
        border: 2.5px solid #fff;
        background: linear-gradient(135deg,#7c2b5c 0%,#4a1e47 100%) !important;
      }
      .offer-popular-badge {
        position: absolute;
        top: 0.7rem;
        right: 0.7rem;
        background: #b9b6e3;
        color: #3a2b4a;
        font-size: 0.95rem;
        font-weight: 700;
        border-radius: 0.7rem;
        padding: 0.2rem 1.1rem;
        z-index: 2;
      }
      .offer-label {
        font-size: 1.35rem;
        font-weight: 800;
        margin-bottom: 0.2rem;
      }
      .offer-quality {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 0.7rem;
        color: #b9b6e3;
      }
      .offer-desc {
        list-style: none;
        padding: 0;
        margin: 0 0 1.2rem 0;
        color: #fff;
        font-size: 1.01rem;
        li {
          margin-bottom: 0.3rem;
          position: relative;
          padding-left: 1.2em;
        }
        li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #b9b6e3;
          font-weight: bold;
        }
      }
      .offer-price {
        font-size: 1.25rem;
        font-weight: 800;
        margin-top: 0.7rem;
        color: #fff;
      }
    }
  }
  .episode-clickable:hover {
    box-shadow: 0 4px 24px rgba(0,0,0,0.22);
    background: rgba(60,60,60,0.18) !important;
    transition: box-shadow 0.18s, background 0.18s;
  }
`; 