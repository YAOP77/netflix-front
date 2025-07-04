import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const OFFERS = [
  {
    key: "mobile",
    title: "Mobile",
    resolution: "480p",
    price: "2,99 €",
    priceUSD: "USD 2.99",
    quality: "Correcte",
    qualityEN: "Fair",
    devices: "Téléphone mobile, tablette",
    devicesEN: "Mobile phone, tablet",
    streams: 1,
    downloads: 1,
    color: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  },
  {
    key: "basic",
    title: "Essentiel",
    resolution: "720p (HD)",
    price: "3,99 €",
    priceUSD: "USD 3.99",
    quality: "Bonne",
    qualityEN: "Good",
    devices: "TV, ordinateur, mobile, tablette",
    devicesEN: "TV, computer, mobile phone, tablet",
    streams: 1,
    downloads: 1,
    color: "linear-gradient(135deg, #283e51 0%, #485563 100%)",
  },
  {
    key: "standard",
    title: "Standard",
    resolution: "1080p (Full HD)",
    price: "7,99 €",
    priceUSD: "USD 7.99",
    quality: "Excellente",
    qualityEN: "Great",
    devices: "TV, ordinateur, mobile, tablette",
    devicesEN: "TV, computer, mobile phone, tablet",
    streams: 2,
    downloads: 2,
    color: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  },
  {
    key: "premium",
    title: "Premium",
    resolution: "4K (Ultra HD) + HDR",
    price: "9,99 €",
    priceUSD: "USD 9.99",
    quality: "Meilleure",
    qualityEN: "Best",
    devices: "TV, ordinateur, mobile, tablette",
    devicesEN: "TV, computer, mobile phone, tablet",
    streams: 4,
    downloads: 6,
    color: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
    popular: true,
    audio: "Audio spatial (son immersif) inclus",
    audioEN: "Spatial audio (immersive sound) Included",
  },
];

export default function OfferPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(location.state?.offer?.key || null);

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
            style={{ border: selected === offer.key ? '2.5px solid #0071eb' : '1.5px solid #ddd' }}
            onClick={() => setSelected(offer.key)}
          >
            {offer.popular && <div className="offer-popular-badge">Most Popular</div>}
            <div className="offer-header" style={{ background: offer.color }}>
              <div className="offer-header-title">
                <span>{offer.title}</span>
                <span className="offer-res">{offer.resolution}</span>
              </div>
              {selected === offer.key && <span className="offer-check">✔</span>}
            </div>
            <div className="offer-body">
              <div className="offer-row">
                <span className="offer-label">Monthly price</span>
                <span className="offer-value">
                  {offer.priceUSD}
                  <span className="offer-fcfa">{`(${Math.round(parseFloat(offer.priceUSD.replace('USD','').replace(',','.'))*600)} FCFA)`}</span>
                </span>
              </div>
              <div className="offer-sep" />
              <div className="offer-row">
                <span className="offer-label">Video and sound quality</span>
                <span className="offer-value">{offer.qualityEN}</span>
              </div>
              <div className="offer-sep" />
              <div className="offer-row">
                <span className="offer-label">Resolution</span>
                <span className="offer-value">{offer.resolution}</span>
              </div>
              {offer.audioEN && <><div className="offer-sep" /><div className="offer-row"><span className="offer-label">Spatial audio (immersive sound)</span><span className="offer-value">Included</span></div></>}
              <div className="offer-sep" />
              <div className="offer-row">
                <span className="offer-label">Supported devices</span>
                <span className="offer-value">{offer.devicesEN}</span>
              </div>
              <div className="offer-sep" />
              <div className="offer-row">
                <span className="offer-label">Devices your household can watch at the same time</span>
                <span className="offer-value">{offer.streams}</span>
              </div>
              <div className="offer-sep" />
              <div className="offer-row">
                <span className="offer-label">Download devices</span>
                <span className="offer-value">{offer.downloads}</span>
              </div>
            </div>
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
    min-width: 290px;
    max-width: 340px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    border: 1.5px solid #ddd;
    overflow: hidden;
    transition: box-shadow 0.18s, border 0.18s;
    .offer-header {
      width: 100%;
      border-radius: 18px 18px 0 0;
      padding: 1.1rem 1.2rem 0.7rem 1.2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      .offer-header-title {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        span {
          color: #fff;
          font-size: 1.18rem;
          font-weight: 700;
        }
        .offer-res {
          font-size: 1rem;
          font-weight: 400;
          color: #e0e0e0;
        }
      }
      .offer-check {
        position: absolute;
        top: 1.1rem;
        right: 1.2rem;
        background: #fff;
        color: #0071eb;
        border-radius: 50%;
        width: 1.7rem;
        height: 1.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        font-weight: 900;
        box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      }
    }
    .offer-body {
      width: 100%;
      padding: 1.2rem 1.2rem 1.2rem 1.2rem;
      background: #fff;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .offer-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.04rem;
      color: #222;
      font-weight: 500;
      margin-bottom: 0.1rem;
    }
    .offer-label {
      color: #666;
      font-weight: 400;
      font-size: 1.01rem;
    }
    .offer-value {
      font-weight: 600;
      color: #222;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .offer-fcfa {
        font-size: 0.98rem;
        color: #0071eb;
        font-weight: 500;
        margin-top: 0.1rem;
      }
    }
    .offer-sep {
      width: 100%;
      height: 1px;
      background: #eee;
      margin: 0.5rem 0 0.5rem 0;
    }
    .offer-popular-badge {
      position: absolute;
      top: -1.5rem;
      left: 50%;
      transform: translateX(-50%);
      background: #444;
      color: #fff;
      font-size: 0.95rem;
      font-weight: 700;
      padding: 0.3rem 1.2rem;
      border-radius: 8px 8px 0 0;
      letter-spacing: 0.02em;
      z-index: 2;
    }
  }
  .offer-selected {
    border: 2.5px solid #0071eb !important;
    box-shadow: 0 6px 32px 0 rgba(0,113,235,0.18);
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