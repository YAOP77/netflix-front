import React from "react";
import styled from "styled-components";
import CardSlider from "./CardSlider";
export default function Slider({ movies }) {
  const getMoviesFromRange = (from, to) => {
    return movies.slice(from, to);
  };
  return (
    <Container>
      <CardSlider data={getMoviesFromRange(0, 10)} title="Tendances" />
      <CardSlider data={getMoviesFromRange(10, 20)} title="Nouveautés" />
      <CardSlider
        data={getMoviesFromRange(20, 30)}
        title="Blockbusters"
      />
      <CardSlider
        data={getMoviesFromRange(30, 40)}
        title="Populaires sur Netflix"
      />
      <CardSlider data={getMoviesFromRange(40, 50)} title="Films d'action" />
      <CardSlider data={getMoviesFromRange(50, 60)} title="Épiques" />
    </Container>
  );
}

const Container = styled.div``;
