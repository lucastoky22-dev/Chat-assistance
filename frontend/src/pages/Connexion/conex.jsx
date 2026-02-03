return (
  <>
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#1f1e1f",
        minHeight: "100vh",
      }}
    >
      {/* POPUP TOAST */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#1f1e1f",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 5,
            borderRadius: 4,
            bgcolor: "#2a2a2a",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={submit}
            noValidate
            autoComplete="off"
            style={{ width: "100%" }}
          >
            <Stack spacing={3}>
              <img
                src={userLogo}
                alt="user"
                style={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 12,
                  margin: "0 auto",
                }}
              />

              {/* Champ matricule */}
              <TextField
                label="Matricule"
                variant="outlined"
                type="text"
                name="matr"
                id="matr"
                size="small"
                error={mtrError}
                InputProps={{
                  endAdornment: (
                    <PersonIcon sx={{ mr: 1, color: "#bbbbbb" }} />
                  ),
                }}
                sx={{
                  bgcolor: "#3a3a3a",
                  borderRadius: 2,
                  input: { color: "#f0f0f0" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#555555" },
                    "&:hover fieldset": { borderColor: "#888888" },
                    "&.Mui-focused fieldset": { borderColor: "#1e90ff" },
                  },
                }}
              />

              {/* Champ mot de passe */}
              <TextField
                label="Mot de passe"
                variant="outlined"
                type="password"
                name="pass"
                id="pass"
                size="small"
                error={passwordError}
                InputProps={{
                  endAdornment: (
                    <LockIcon sx={{ mr: 1, color: "#bbbbbb" }} />
                  ),
                }}
                sx={{
                  bgcolor: "#3a3a3a",
                  borderRadius: 2,
                  input: { color: "#f0f0f0" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#555555" },
                    "&:hover fieldset": { borderColor: "#888888" },
                    "&.Mui-focused fieldset": { borderColor: "#1e90ff" },
                  },
                }}
              />

              <Typography
                variant="caption"
                align="center"
                sx={{ color: "red", minHeight: 20 }}
              >
                {uxMessage}
              </Typography>

              <Button
                type="submit"
                variant="contained"
                size="medium"
                endIcon={<LoginIcon />}
                sx={{
                  bgcolor: "linear-gradient(135deg, #3d3d3d, #4a4a4a)",
                  borderRadius: 3,
                  py: 1.2,
                  fontWeight: 600,
                  color: "#fff" 
                }}
              >
                  Connexion
              </Button>
            </Stack>
        </form>
    </Paper>
</Box>
</div>
    </>
);

/*
 <form
                    onSubmit={submit}
                    noValidate
                    autoComplete="off"
                    style={{ width: "100%" }}
                >
                    <Stack spacing={2}>
                        <img
                            src={userLogo}
                            alt="user"
                            style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 8,
                                margin: "0 auto",
                            }}
                        />

                        {/* Champ matricule */}
                        <TextField
                            label="Matricule"
                            variant="outlined"
                            type="text"
                            name="matr"
                            id="matr"
                            
                            size="small"
                            error={mtrError}
                            InputProps={{
                                endAdornment: (
                                    <PersonIcon sx={{ mr: 1, color: "#2b2b2bff" }} />
                                ),
                            }}
                            sx={{
                                bgcolor: "#fafafa",
                                borderRadius: 2,
                            }}
                        />

                        {/* Champ mot de passe */}
                        <TextField
                            label="Mot de passe"
                            variant="outlined"
                            type="password"
                            name="pass"
                            id="pass"
                            size="small"
                            error={passwordError}
                            InputProps={{
                                endAdornment: (
                                    <LockIcon sx={{ mr: 1, color: "#2b2b2bff" }} />
                                ),
                            }}
                            sx={{
                                bgcolor: "#fafafa",
                                borderRadius: 2,
                            }}
                        />

                        <Typography
                            variant="caption"
                            align="center"
                            sx={{ color: "red", minHeight: 20 }}
                        >
                            {uxMessage}
                        </Typography>

                        <Button
                            type="submit"
                            variant="contained"
                            size="medium"
                            endIcon={<LoginIcon />}
                            sx={{
                                bgcolor: "#3d3d3dff",
                                borderRadius: 3,
                                py: 1,
                                "&:hover": { bgcolor: "#4444441f" },
                                boxShadow: "0 3px 10px rgba(5, 5, 5, 0.55)",
                            }}
                        >
                            Connexion
                        </Button>
                    </Stack>
                </form>
*/
