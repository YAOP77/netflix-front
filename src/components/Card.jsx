import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BiChevronDown } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { removeMovieFromLiked, addMovieToLiked } from "../store";
import axios from "axios";
import { TMDB_BASE_URL, API_KEY } from "../utils/constants";
import logoNetflix from "../assets/logo-logomark.png";
// import video from "../assets/video.mp4";

export default React.memo(function Card({ index, movieData, isLiked = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).email : undefined;
  });

  const addToList = () => {
    dispatch(addMovieToLiked({ email, data: movieData }));
  };

  // Handler pour naviguer vers la page de détails du film
  const handleShowDetails = () => {
    navigate(`/movie/${movieData.id}`, { state: { movie: movieData } });
  };

  return (
    <Container onClick={handleShowDetails}>
      <div className="card-image-container">
        <img
          className="card-image"
          src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
          alt={movieData.name}
        />
        <img src={logoNetflix} alt="Netflix logo" className="netflix-logo" />
        <div className="card-title-bg">
          <span className="card-title">{movieData.name}</span>
        </div>
      </div>
    </Container>
  );
});

const Container = styled.div`
  width: 180px;
  min-width: 180px;
  max-width: 180px;
  aspect-ratio: 2/3;
  margin: 0 0.7rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .card-image-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 1.1rem;
    overflow: hidden;
    box-shadow: 0 6px 32px 0 rgba(0,0,0,0.38), 0 1.5px 8px 0 rgba(0,0,0,0.18);
    background: #181818;
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1.1rem;
      display: block;
      background: #181818;
    }
    .netflix-logo {
      position: absolute;
      top: 0.7rem;
      left: 0.7rem;
      width: 2.1rem;
      height: 2.1rem;
      z-index: 2;
      background: rgba(0,0,0,0.18);
      border-radius: 0.4rem;
      padding: 0.15rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    }
    .card-title-bg {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      min-height: 2.7rem;
      background: linear-gradient(180deg,rgba(0,0,0,0.01) 0%,rgba(0,0,0,0.85) 100%);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0.7rem 0.7rem 0.5rem 0.7rem;
      z-index: 2;
    }
    .card-title {
      color: #fff;
      font-size: 1.15rem;
      font-weight: 800;
      text-align: center;
      width: 100%;
      text-shadow: 0 2px 8px rgba(0,0,0,0.55);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.2;
      max-height: 2.7em;
    }
  }
`;
