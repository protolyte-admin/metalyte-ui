import { createTheme } from "@mui/material/styles";

export const marqTokens = {
    background: {
        primary: "#01030A",
        secondary: "#050A18",
        card: "#0B1324",
        elevated: "#121B31"
    },
    accent: {
        primary: "#2F18F6",
        hover: "#432DFF",
        soft: "#7B6DFF",
        pale: "#D8D4FF"
    },
    text: {
        primary: "#FFFFFF",
        secondary: "#BBC3D8",
        muted: "#74809E"
    },
    success: "#00D26A",
    warning: "#F5A524",
    border: "rgba(255,255,255,0.09)"
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
        warning: {
            main: marqTokens.warning
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
                    background: "linear-gradient(135deg, #2F18F6 0%, #1F0ED6 100%)",
                    boxShadow: "0 14px 32px rgba(47,24,246,0.32)",
                    "&:hover": {
                        boxShadow: "0 16px 36px rgba(47,24,246,0.42)",
                        background: "linear-gradient(135deg, #432DFF 0%, #2F18F6 100%)"
                    }
                },
                outlined: {
                    borderColor: "rgba(255,255,255,0.16)",
                    color: marqTokens.text.primary,
                    "&:hover": {
                        borderColor: "rgba(123,109,255,0.58)",
                        backgroundColor: "rgba(47,24,246,0.1)"
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
                        borderColor: "rgba(123,109,255,0.48)"
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: marqTokens.accent.soft
                    }
                },
                input: {
                    "&::placeholder": {
                        color: "#919BB6",
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