import React from "react";
import styled from "styled-components";

export default function Footer() {
  return (
    <FooterContainer>
      <div className="footer-content">
        <div className="footer-row">
          <a href="#" className="footer-link">Des questions ? Contactez-nous.</a>
        </div>
        <div className="footer-links-grid">
          <a href="#" className="footer-link">FAQ</a>
          <a href="#" className="footer-link">Centre d'aide</a>
          <a href="#" className="footer-link">Compte</a>
          <a href="#" className="footer-link">Presse</a>
          <a href="#" className="footer-link">Relations Investisseurs</a>
          <a href="#" className="footer-link">Recrutement</a>
          <a href="#" className="footer-link">Modes de lecture</a>
          <a href="#" className="footer-link">Conditions d'utilisation</a>
          <a href="#" className="footer-link">Confidentialité</a>
          <a href="#" className="footer-link">Préférences de cookies</a>
          <a href="#" className="footer-link">Mentions légales</a>
          <a href="#" className="footer-link">Nous contacter</a>
          <a href="#" className="footer-link">Test de vitesse</a>
          <a href="#" className="footer-link">Informations légales</a>
          <a href="#" className="footer-link">Seulement sur Netflix</a>
        </div>
        <div className="footer-row">
          <button className="footer-lang-btn"><span role="img" aria-label="langue">🌐</span> Français <span style={{marginLeft:'0.3em'}}>▼</span></button>
        </div>
        <div className="footer-row footer-country">Netflix Côte d'Ivoire</div>
        <div className="footer-row footer-disclaimer">
          Cette page est protégée par Google reCAPTCHA pour nous assurer que vous n'êtes pas un robot. <a href="#" className="footer-link">En savoir plus.</a>
        </div>
      </div>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  width: 100vw;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(2px);
  color: #fff;
  padding: 2.5rem 0 1.5rem 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 1.05rem;
  .footer-content {
    width: 100%;
    max-width: 1100px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }
  .footer-row {
    margin-bottom: 0.7rem;
  }
  .footer-links-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(160px, 1fr));
    gap: 0.5rem 1.2rem;
    margin-bottom: 1.2rem;
    width: 100%;
    @media (max-width: 900px) {
      grid-template-columns: repeat(2, minmax(160px, 1fr));
    }
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }
  .footer-link {
    color: #b3b3b3;
    text-decoration: none;
    font-size: 1.01rem;
    transition: color 0.18s, text-decoration 0.18s;
    &:hover {
      color: #fff;
      text-decoration: underline;
    }
  }
  .footer-lang-btn {
    background: none;
    border: 1px solid #888;
    color: #fff;
    border-radius: 0.3rem;
    padding: 0.4rem 1.2rem;
    font-size: 1.01rem;
    cursor: pointer;
    margin-bottom: 0.7rem;
    display: flex;
    align-items: center;
    gap: 0.5em;
    transition: border 0.18s, background 0.18s;
    &:hover {
      border: 1.5px solid #fff;
      background: rgba(255,255,255,0.04);
    }
  }
  .footer-country {
    color: #b3b3b3;
    font-size: 1.01rem;
    margin-bottom: 0.7rem;
  }
  .footer-disclaimer {
    color: #b3b3b3;
    font-size: 0.98rem;
    margin-top: 0.7rem;
    a {
      color: #b3b3b3;
      text-decoration: underline;
      &:hover { color: #fff; }
    }
  }
`; 