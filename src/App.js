import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MoviePage from "./pages/Movies";
import Netflix from "./pages/Netflix";
import Player from "./pages/Player";
import Signup from "./pages/Signup";
import TVShows from "./pages/TVShows";
import UserListedMovies from "./pages/UserListedMovies";
import MovieDetails from "./pages/MovieDetails";
import OfferPage from "./pages/OfferPage";
import "./utils/debug";
import Footer from "./components/Footer";

console.log(process.env.REACT_APP_API_URL);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/player" element={<Player />} />
        <Route exact path="/tv" element={<TVShows />} />
        <Route exact path="/movies" element={<MoviePage />} />
        <Route exact path="/new" element={<Player />} />
        <Route exact path="/mylist" element={<UserListedMovies />} />
        <Route exact path="/movie/:id" element={<MovieDetails />} />
        <Route exact path="/tv/:id" element={<MovieDetails />} />
        <Route exact path="/offers" element={<OfferPage />} />
        <Route exact path="/" element={<Netflix />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
