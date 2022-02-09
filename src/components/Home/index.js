import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Social from "../Social";
import Welcome from "./Welcome";
import Footer from "../Footer";

const Home = () => {
  return (
    <Box>
      <Container maxWidth="xl">
        <Welcome />
        <Social />
      </Container>
      <Footer />
    </Box>
  );
};

export default Home;
