import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/home.jpg";
import MovieLogo from "../assets/homeTitle.webp";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres } from "../store";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Slider from "../components/Slider";

function Netflix() {
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: "all" }));
    }
  }, [genresLoaded]);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  // Filtrage en temps réel
  const filteredMovies = search.trim().length === 0
    ? movies
    : movies.filter(m => m.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Rechercher un film..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="hero">
        <img
          src={backgroundImage}
          alt="background"
          className="background-image"
        />
        <div className="container">
          <div className="logo">
            <img src={MovieLogo} alt="Movie Logo" />
          </div>
          <div className="buttons flex">
            <button
              onClick={() => navigate("/player")}
              className="flex j-center a-center"
            >
              <FaPlay />
              Play
            </button>
            <button className="flex j-center a-center">
              <AiOutlineInfoCircle />
              More Info
            </button>
          </div>
        </div>
      </div>
      <Slider movies={filteredMovies} />
    </Container>
  );
}

const Container = styled.div`
  background-color: black;
  .search-bar-container {
    width: 100vw;
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    z-index: 20;
    position: relative;
  }
  .search-bar {
    width: 340px;
    max-width: 90vw;
    padding: 0.7rem 1.2rem;
    border-radius: 2rem;
    border: 1.5px solid #444;
    font-size: 1.1rem;
    background: rgba(30,30,30,0.82);
    color: #fff;
    outline: none;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    transition: border 0.18s, box-shadow 0.18s;
    margin-bottom: 0.5rem;
  }
  .search-bar:focus {
    border: 1.5px solid #fff;
    box-shadow: 0 4px 18px rgba(0,0,0,0.18);
  }
  .hero {
    position: relative;
    .background-image {
      filter: brightness(60%);
    }
    img {
      height: 100vh;
      width: 100vw;
    }
    .container {
      position: absolute;
      bottom: 5rem;
      .logo {
        img {
          width: 100%;
          height: 100%;
          margin-left: 5rem;
        }
      }
      .buttons {
        margin: 5rem;
        gap: 2rem;
        button {
          font-size: 1.4rem;
          gap: 1rem;
          border-radius: 0.2rem;
          padding: 0.5rem;
          padding-left: 2rem;
          padding-right: 2.4rem;
          border: none;
          cursor: pointer;
          transition: 0.2s ease-in-out;
          &:hover {
            opacity: 0.8;
          }
          &:nth-of-type(2) {
            background-color: rgba(109, 109, 110, 0.7);
            color: white;
            svg {
              font-size: 1.8rem;
            }
          }
        }
      }
    }
  }
`;
export default Netflix;
