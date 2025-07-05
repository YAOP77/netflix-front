import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/home.jpg";
import MovieLogo from "../assets/Logo-Netflix.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres } from "../store";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Slider from "../components/Slider";

function Netflix() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);

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
    : movies.filter(movie =>
        movie.name?.toLowerCase().includes(search.toLowerCase()) ||
        movie.title?.toLowerCase().includes(search.toLowerCase())
      );

  // Film principal affiché en grand (le premier de la liste filtrée)
  const mainMovie = filteredMovies[0];

  return (
    <Container>
      <Navbar isScrolled={isScrolled} onSearchChange={setSearch} />
      <div className="hero">
        <img
          src={backgroundImage}
          alt="background"
          className="background-image"
        />
        <div className="container">
          <div className="logo">
            <img src={MovieLogo} alt="Netflix Logo" style={{ maxWidth: '350px', filter: 'drop-shadow(0 0 16px #000)' }} />
          </div>
          <div className="buttons flex">
            <button
              onClick={() => mainMovie && navigate(`/${mainMovie.type || 'movie'}/${mainMovie.id}`, { state: { type: mainMovie.type || 'movie' } })}
              className="flex j-center a-center"
              disabled={!mainMovie}
              style={!mainMovie ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <FaPlay />
              Play
            </button>
            <button
              className="flex j-center a-center"
              onClick={() => mainMovie && navigate(`/${mainMovie.type || 'movie'}/${mainMovie.id}`, { state: { type: mainMovie.type || 'movie' } })}
              disabled={!mainMovie}
              style={!mainMovie ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <AiOutlineInfoCircle />
              More Info
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Netflix;