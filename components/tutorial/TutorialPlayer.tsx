import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

interface TutorialPlayerProps {
  src: string;
  title: string;
}

export default function TutorialPlayer({ src, title }: TutorialPlayerProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        py: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#FFD700",
          textAlign: "center",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          aspectRatio: "16/9",
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(255, 215, 0, 0.2)",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {loading && !error && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <CircularProgress sx={{ color: "#FFD700" }} />
          </Box>
        )}

        {error ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#aaa",
            }}
          >
            <Typography>Video tidak ditemukan</Typography>
            <Typography variant="caption" sx={{ mt: 1 }}>
              {src}
            </Typography>
          </Box>
        ) : (
          <video
            controls
            autoPlay
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onLoadedData={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </Box>
    </Box>
  );
}
