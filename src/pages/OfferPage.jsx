import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const OFFERS = [
  {
    key: "mobile",
    title: "Mobile",
    resolution: "480p",
    price: "2,99 €",
    quality: "Qualité vidéo et audio : Correcte",
    devices: "Téléphone mobile, tablette",
    downloads: "1 appareil",
    color: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  },
  {
    key: "basic",
    title: "Essentiel",
    resolution: "720p (HD)",
    price: "3,99 €",
    quality: "Qualité vidéo et audio : Bonne",
    devices: "TV, ordinateur, mobile, tablette",
    downloads: "1 appareil",
    color: "linear-gradient(135deg, #283e51 0%, #485563 100%)",
  },
  {
    key: "standard",
    title: "Standard",
    resolution: "1080p (Full HD)",
    price: "7,99 €",
    quality: "Qualité vidéo et audio : Excellente",
    devices: "TV, ordinateur, mobile, tablette",
    downloads: "2 appareils",
    color: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  },
  {
    key: "premium",
    title: "Premium",
    resolution: "4K (Ultra HD) + HDR",
    price: "9,99 €",
    quality: "Qualité vidéo et audio : Meilleure",
    devices: "TV, ordinateur, mobile, tablette",
    downloads: "6 appareils",
    color: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
    popular: true,
    audio: "Audio spatial (son immersif) inclus",
  },
];

export default function OfferPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selected = location.state?.offer?.key;

  return (
    <Container>
      <div className="header">
        <h2>Choisissez l'offre qui vous convient</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>Retour</button>
      </div>
      <div className="offers-row">
        {OFFERS.map((offer) => (
          <div
            key={offer.key}
            className={`offer-card${selected === offer.key ? " offer-selected" : ""}${offer.popular ? " offer-popular" : ""}`}
            style={{ background: offer.color, border: selected === offer.key ? '2.5px solid #e50914' : '1.5px solid #888' }}
          >
            {offer.popular && <div className="offer-popular-badge">La plus populaire</div>}
            <div className="offer-title">{offer.title} <span className="offer-res">{offer.resolution}</span></div>
            <div className="offer-price">{offer.price} / mois</div>
            <div className="offer-quality">{offer.quality}</div>
            <div className="offer-devices">Appareils compatibles : {offer.devices}</div>
            <div className="offer-downloads">Téléchargements : {offer.downloads}</div>
            {offer.audio && <div className="offer-audio">{offer.audio}</div>}
          </div>
        ))}
      </div>
      <div className="footer">
        <button className="next-btn">Suivant</button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  padding: 0 0 48px 0;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32px 32px 0 32px;
    h2 {
      font-size: 2.1rem;
      font-weight: 700;
      color: #222;
    }
    .back-btn {
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.18s;
      &:hover {
        background: #b0060f;
      }
    }
  }
  .offers-row {
    display: flex;
    gap: 2.5rem;
    justify-content: center;
    margin: 48px 0 0 0;
    flex-wrap: wrap;
  }
  .offer-card {
    min-width: 260px;
    max-width: 320px;
    border-radius: 18px;
    padding: 2.2rem 1.5rem 1.5rem 1.5rem;
    color: #fff;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    .offer-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.7rem;
      .offer-res {
        font-size: 1rem;
        font-weight: 400;
        margin-left: 0.5rem;
        color: #e0e0e0;
      }
    }
    .offer-price {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .offer-quality, .offer-devices, .offer-downloads, .offer-audio {
      font-size: 1rem;
      margin-bottom: 0.3rem;
    }
    .offer-popular-badge {
      position: absolute;
      top: -1.5rem;
      left: 50%;
      transform: translateX(-50%);
      background: #222;
      color: #fff;
      font-size: 0.95rem;
      font-weight: 700;
      padding: 0.3rem 1.2rem;
      border-radius: 8px 8px 0 0;
      letter-spacing: 0.02em;
    }
  }
  .offer-selected {
    border: 2.5px solid #e50914 !important;
    box-shadow: 0 6px 32px 0 rgba(229,9,20,0.18);
  }
  .offer-popular {
    box-shadow: 0 8px 32px 0 rgba(229,9,20,0.18);
  }
  .footer {
    display: flex;
    justify-content: center;
    margin-top: 48px;
    .next-btn {
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 1rem 3.5rem;
      font-size: 1.3rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.18s;
      &:hover {
        background: #b0060f;
      }
    }
  }
`; 