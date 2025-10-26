"use client"

import { TextField, TextFieldProps } from "@mui/material"

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#ECECEC",
    backgroundColor: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(6px)",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(255,215,0,0.2)",
      transition: "all 0.3s ease",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,215,0,0.4)",
      boxShadow: "0 0 8px rgba(255,215,0,0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FFD700",
      boxShadow: "0 0 15px rgba(255,215,0,0.4)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#FFD700",
    fontWeight: 500,
    letterSpacing: "0.3px",
    "&.Mui-focused": {
      color: "#FFE55C",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "1.05rem",
    padding: "16px 18px",
  },
  "& input[type=date]": {
    colorScheme: "dark",
  },
}

export default function CustomTextField(props: TextFieldProps) {
  return (
    <TextField
      variant="outlined"
      fullWidth
      {...props}
      sx={{ ...inputStyle, ...(props.sx || {}) }}
    />
  )
}
