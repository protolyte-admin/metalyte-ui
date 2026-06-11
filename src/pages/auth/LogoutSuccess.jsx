import { Avatar, Box, CardContent, Link, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircle";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

import MarqButton from "../../components/common/MarqButton";
import MarqCard from "../../components/common/MarqCard";

export default function LogoutSuccess() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                px: 2,
                py: {
                    xs: 5,
                    md: 7
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "radial-gradient(circle at 86% 7%, rgba(38,57,94,0.48), transparent 23rem), linear-gradient(90deg, #071834 0%, #020B1F 44%, #06152B 100%)"
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 610 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 5
                    }}
                >
                    <Avatar
                        sx={{
                            width: 78,
                            height: 78,
                            borderRadius: 3,
                            bgcolor: "#5B4BFF",
                            mb: 2.5
                        }}
                    >
                        <RocketLaunchOutlinedIcon sx={{ fontSize: 42 }} />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Marq Studio
                    </Typography>
                </Box>

                <MarqCard>
                    <CardContent
                        sx={{
                            p: {
                                xs: 4,
                                sm: 7
                            },
                            textAlign: "center"
                        }}
                    >
                        <Box
                            sx={{
                                width: 92,
                                height: 92,
                                mx: "auto",
                                mb: 4,
                                borderRadius: "50%",
                                border: "1px solid rgba(185,174,255,0.24)",
                                display: "grid",
                                placeItems: "center",
                                bgcolor: "rgba(255,255,255,0.03)"
                            }}
                        >
                            <CheckCircleOutlineIcon
                                sx={{
                                    fontSize: 54,
                                    color: "#C5BEFF"
                                }}
                            />
                        </Box>

                        <Typography
                            variant="h3"
                            sx={{
                                mb: 2,
                                fontSize: {
                                    xs: 30,
                                    sm: 38
                                }
                            }}
                        >
                            Securely Logged Out
                        </Typography>

                        <Typography
                            sx={{
                                color: "text.secondary",
                                fontSize: 19,
                                lineHeight: 1.5,
                                maxWidth: 450,
                                mx: "auto",
                                mb: 5
                            }}
                        >
                            You have been successfully logged out of your enterprise
                            session. Thank you for using Marq Studio.
                        </Typography>

                        <MarqButton
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/login", { replace: true })}
                            sx={{
                                minHeight: 58,
                                mb: 4,
                                letterSpacing: 1.4
                            }}
                        >
                            RETURN TO LOGIN
                        </MarqButton>

                        <Typography color="text.secondary">
                            Need help?{" "}
                            <Link underline="none" sx={{ color: "#CDC7FF", fontWeight: 700 }}>
                                Contact Support
                            </Link>
                        </Typography>
                    </CardContent>
                </MarqCard>

                <Box
                    sx={{
                        mt: 6,
                        display: "flex",
                        justifyContent: "center",
                        gap: 4,
                        color: "#727C9C",
                        flexWrap: "wrap"
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}
                    >
                        <ShieldOutlinedIcon sx={{ fontSize: 16 }} />
                        Enterprise Secure
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}
                    >
                        <LockOutlinedIcon sx={{ fontSize: 16 }} />
                        Data Encrypted
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
