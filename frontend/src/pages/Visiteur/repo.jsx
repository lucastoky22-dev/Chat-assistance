 return (
    <Box
        sx={{/*
            width: "100vw",
            height: "100vh",
            bgcolor: "#f5f6fa",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,*/
            background: "#2d2b2dff",
        }}
    >
    
      {/* POPUP TOAST */}
      <ToastContainer
        position="top-center"   // ici tu choisis la position
        autoClose={3000}        // auto fermeture après 3s
        hideProgressBar={true} // si tu veux la barre de progression
        newestOnTop={false}      // le toast le plus récent en haut
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <Paper
            elevation={4}
            sx={{
                width: "700px",
                height: "100vh",
                bgcolor: "#252425ff",
                //borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                fontFamily: "Inter, sans-serif",
                margin:"auto",

            }}
        >

            <Box
                sx={{
                    p: 2,
                    //borderBottom: "1px solid #e3e3e3",
                    background: "#252425ff",
                    borderBottom:"1px solid #252425ff",
                    boxShadow: "0 4px 12px rgba(79, 84, 88, 0.3)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                  <Typography
                      variant="h6"
                      sx={{
                          fontWeight: 600,
                          display: "flex",
                          color:"wheat",
                          alignItems: "center",
                          gap: 1.2,
                          fontFamily: "Inter, sans-serif",
                      }}
                  >
                      <Avatar
                          sx={{
                              bgcolor: "#474747ff",
                              width: 32,
                              height: 32,
                              fontSize: "0.9rem",
                          }}
                      >
                          
                      </Avatar>
                  </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    p: 2,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    background: "#252425ff",
                }}
            >
                {messages.map((msg, index) => (
                    OwnMessage(user, msg, index)
                ))}
                
            </Box>

            <Box
                sx={{
                    p: 2,
                    //borderTop: "1px solid #e3e3e3",
                    bgcolor: "#1b1a1b7e",
                    backdropFilter: "blur(8px)",
                }}
            >
                <Stack direction="row" spacing={1}>
                    <TextField
                        variant="outlined"
                        placeholder="En quoi peut-on vous aidez ..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        fullWidth
                        sx={{
                           
                            "& .MuiOutlinedInput-root": {
                                //borderRadius: 3,
                                background: "#171717ff",
                                color:"white",
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        sx={{
                            background: "#444247ff",
                            px: 3,
                            //borderRadius: 3,
                            boxShadow: "0 4px 12px rgba(79, 84, 88, 0.3)",
                            "&:hover": { background: "#5a5a5aff" },
                        }}
                        onClick={() => {
                            sendMessage(input);
                            setInput("");
                        }}
                    >
                        Envoyer
                    </Button>
                </Stack>
            </Box>
        </Paper>
    </Box>
);