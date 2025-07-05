import React from "react";
import styled from "styled-components";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";

export default function Player() {
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie;
  const trailerUrl = movie?.trailerUrl;

  return (
    <Container>
      <div className="player">
        <div className="back">
          <BsArrowLeft onClick={() => navigate(-1)} />
        </div>
        {trailerUrl ? (
          <iframe
            width="80%"
            height="500"
            src={trailerUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div style={{ color: "#fff" }}>Aucune bande-annonce trouvée.</div>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .player {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: #000;
    .back {
      position: absolute;
      padding: 2rem;
      z-index: 1;
      top: 0;
      left: 0;
      svg {
        font-size: 3rem;
        cursor: pointer;
      }
    }
  }
`;
