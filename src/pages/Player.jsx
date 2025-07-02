import React from "react";
import styled from "styled-components";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";

export default function Player() {
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie;
  const videoUrl = movie?.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <Container>
      <div className="player">
        <div className="back">
          <BsArrowLeft onClick={() => navigate(-1)} />
        </div>
        <video
          src={videoUrl}
          controls
          width="80%"
          height="auto"
          style={{ background: "#000" }}
        />
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
