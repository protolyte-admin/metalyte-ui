import { createTheme } from "@mui/material/styles";

export const marqTokens = {
    background: {
        primary: "#020B1F",
        secondary: "#08162F",
        card: "#16233D",
        elevated: "#20304A"
    },
    accent: {
        primary: "#5B4BFF",
        soft: "#B9AEFF"
    },
    text: {
        primary: "#F5F7FF",
        secondary: "#A8B0D0",
        muted: "#727C9C"
    },
    success: "#00D26A",
    border: "rgba(255,255,255,0.08)"
};

const marqTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: marqTokens.accent.primary,
            contrastText: marqTokens.text.primary
        },
        success: {
            main: marqTokens.success
        },
        background: {
            default: marqTokens.background.primary,
            paper: marqTokens.background.card
        },
        text: {
            primary: marqTokens.text.primary,
            secondary: marqTokens.text.secondary
        },
        divider: marqTokens.border
    },
    typography: {
        fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: 0
        },
        h2: {
            fontWeight: 800,
            letterSpacing: 0
        },
        h3: {
            fontWeight: 750,
            letterSpacing: 0
        },
        h4: {
            fontWeight: 750,
            letterSpacing: 0
        },
        button: {
            fontWeight: 700,
            letterSpacing: 0,
            textTransform: "none"
        }
    },
    shape: {
        borderRadius: 8
    },
    spacing: 8,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: marqTokens.background.primary,
                    color: marqTokens.text.primary
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    minHeight: 44,
                    boxShadow: "none",
                    textTransform: "none"
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #5B4BFF 0%, #5141ED 100%)",
                    boxShadow: "0 14px 32px rgba(91,75,255,0.28)",
                    "&:hover": {
                        boxShadow: "0 16px 36px rgba(91,75,255,0.36)",
                        background:
                            "linear-gradient(135deg, #6658FF 0%, #5747F6 100%)"
                    }
                },
                outlined: {
                    borderColor: "rgba(255,255,255,0.16)",
                    color: marqTokens.text.primary,
                    "&:hover": {
                        borderColor: "rgba(185,174,255,0.44)",
                        backgroundColor: "rgba(255,255,255,0.04)"
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundImage: "none",
                    backgroundColor: marqTokens.background.card,
                    border: `1px solid ${marqTokens.border}`
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                    backgroundImage: "none",
                    backgroundColor: marqTokens.background.card,
                    border: `1px solid ${marqTokens.border}`
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: marqTokens.background.elevated,
                    color: marqTokens.text.primary,
                    "& fieldset": {
                        borderColor: "rgba(255,255,255,0.12)"
                    },
                    "&:hover fieldset": {
                        borderColor: "rgba(185,174,255,0.42)"
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: marqTokens.accent.soft
                    }
                },
                input: {
                    "&::placeholder": {
                        color: "#A2A8BC",
                        opacity: 1
                    }
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: marqTokens.text.secondary
                }
            }
        }
    }
});

export default marqTheme;
