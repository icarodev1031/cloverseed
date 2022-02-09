import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Logo from "../../static/images/Anim.-Logo-Header-+-Footer-CS.gif";
import Grid from "@mui/material/Grid";
const Title = styled("h1")({
  fontFamily: `Maven Pro, sans-serif`,
  fontStyle: `normal`,
  fontWeight: `500`,
  fontSize: `13px`,
  lineHeight: `19px`,
  textAlign: "center",
  textTransform: "uppercase",
  color: `#FFFFFF`,
  display: "block",
});
const EnsureText = styled("h1")({
  fontFamily: `Maven Pro, sans-serif`,
  fontStyle: `normal`,
  fontWeight: `600`,
  fontSize: `12px`,
  lineHeight: `22px`,
  textAlign: "center",
  textTransform: "uppercase",
  color: `#FFFFFF`,
  "& > a": {
    color: `#B3E200`,
    paddingLeft: "5px",
  },
  "@media (max-width: 1024px)": {
    fontSize: `10px`,
  },
});
const Image = styled("img")({
  width:"100%",
});
const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        paddingY: "15px",
        "@media (min-width: 1370px)": {
          position: "fixed",
          left: 0,
          bottom: 0,
          right: 0,
          paddingBottom: "30px",
        },
      }}
    >
      <Container maxWidth="xl">
        <Grid container rowSpacing={2} align = "center" justify = "center" alignItems = "center">
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Box>
              <Link to="/">
                <Image src={Logo} alt="" />
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <Box>
              <Title>
                ©2022 Copyright
                <a
                  href="https://clover-seeds.com/"
                  target="_blank"
                  style={{ color: "#fff" }}
                >
                  {" "}
                  CLOVER SEEDS.COM
                </a>{" "}
              </Title>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <Box>
              <Box
                sx={{
                  backgroundColor: "#0f231a",
                  display: "flex",
                  justifyContent: "center",
                  paddingY: "10px",
                  borderRadius: "5px",
                }}
              >
                <EnsureText>
                  Ensure you are at{" "}
                  <a href="https://app.clover-seeds.com">
                    https://app.clover-seeds.com
                  </a>
                </EnsureText>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
