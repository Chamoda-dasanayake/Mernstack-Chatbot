import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";

import Footer from "../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <Box width={"100%"} height={"100%"} display="flex" flexDirection="column">
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          flex: 1, // Takes available space
          mt: 5,
        }}
      >
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontFamily: "work sans",
            fontWeight: "700",
            mb: 2,
            background: "linear-gradient(45deg, #00fffc, #ffffff)",
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to Your AI Assistant
        </Typography>

        <Typography
          variant="h5"
          align="center"
          sx={{
            fontFamily: "work sans",
            mb: 5,
            color: "gray",
            maxWidth: "600px"
          }}
        >
          Experience the power of modern AI in a simple, elegant interface.
        </Typography>

        <Box sx={{ display: "flex", gap: 3, flexDirection: isBelowMd ? "column" : "row" }}>
          {auth?.isLoggedIn ? (
            <Button
              variant="contained"
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.2rem",
                borderRadius: "50px",
                background: "linear-gradient(45deg, #00fffc 30%, #51538f 90%)",
                color: "black",
                fontWeight: "bold",
                ":hover": {
                  background: "linear-gradient(45deg, #51538f 30%, #00fffc 90%)",
                },
              }}
              onClick={() => navigate("/chat")}
            >
              Go to Chat
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.2rem",
                  borderRadius: "50px",
                  bgcolor: "#00fffc",
                  color: "black",
                  fontWeight: "bold",
                  ":hover": {
                    bgcolor: "white",
                    color: "black",
                  },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.2rem",
                  borderRadius: "50px",
                  color: "white",
                  borderColor: "white",
                  fontWeight: "bold",
                  ":hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderColor: "#00fffc",
                  },
                }}
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
            </>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;