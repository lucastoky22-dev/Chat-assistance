import { styled, TextField } from "@mui/material";

const NoBorderTextField = styled(TextField)({
  "& .MuiOutlinedInput-root fieldset": {
    border: "none",
  },
  "& .MuiOutlinedInput-root:hover fieldset": {
    border: "none",
  },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    border: "none",
  },
  width: "auto",          // largeur auto
  "& .MuiOutlinedInput-input": {
    padding: "8px 10px",  // ajuster padding si besoin
  },

});

export default NoBorderTextField