import { Avatar, Box, CardContent, Link, Typography } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";
import MarqCard from "../components/common/MarqCard";
import { useAuth } from "../context/useAuth";
import { login } from "../services/authService";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn } = useAuth();

    // If ProtectedRoute or the 401 interceptor sent us here, send the user
    // back to that page after a successful login.
    const redirectTo =
        location.state?.from?.pathname ||
        new URLSearchParams(location.search).get("from") ||
        "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);

            const data = await login(email, password);

            // authService.login already wrote accessToken / user / organization
            // to localStorage. Tell the in-memory AuthContext about it so
            // ProtectedRoute / PublicRoute re-evaluate and the user is no
            // longer "unauthenticated" from React's point of view.
            signIn({
                accessToken: data.accessToken,
                user: data.user,
                organization: data.organization,
                refreshToken: data.refreshToken
            });

            navigate(redirectTo, { replace: true });
        } catch (error) {
            alert(error?.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

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
                    "radial-gradient(circle at 10% 10%, rgba(50,74,111,0.38), transparent 24rem), radial-gradient(circle at 88% 18%, rgba(28,47,82,0.44), transparent 20rem), linear-gradient(135deg, #102039 0%, #020B1F 46%, #061329 100%)"
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 560 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 4.5
                    }}
                >
                    <Avatar
                        sx={{
                            width: 62,
                            height: 62,
                            bgcolor: "#5B4BFF",
                            borderRadius: 3,
                            mb: 2,
                            boxShadow: "0 18px 45px rgba(91,75,255,0.32)"
                        }}
                    >
                        <GridViewIcon fontSize="large" />
                    </Avatar>

                    <Typography
                        variant="h4"
                        sx={{
                            color: "text.primary",
                            fontSize: 31,
                            fontWeight: 800
                        }}
                    >
                        Metalyte
                    </Typography>

                    <Typography
                        sx={{
                            color: "text.secondary",
                            mt: 0.75,
                            fontSize: 17
                        }}
                    >
                        Business Communication Platform
                    </Typography>
                </Box>

                <MarqCard>
                    <CardContent
                        sx={{
                            p: {
                                xs: 3,
                                sm: 5
                            }
                        }}
                    >
                        <LoginForm
                            email={email}
                            password={password}
                            loading={loading}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                            onSubmit={handleLogin}
                        />
                    </CardContent>
                </MarqCard>

                <Typography textAlign="center" mt={3.5} color="text.secondary">
                    Don't have an account?{" "}
                    <Link
                        component="button"
                        underline="none"
                        sx={{ color: "#CDC7FF", fontWeight: 800 }}
                    >
                        Request Access
                    </Link>
                </Typography>

                <Box
                    sx={{
                        mt: 6,
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 3,
                        color: "#737D98"
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.75,
                            fontWeight: 700
                        }}
                    >
                        <SecurityOutlinedIcon sx={{ fontSize: 16 }} />
                        A product from Protolyte Systems
                    </Typography>
                    {/* <Typography
                        variant="caption"
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.75,
                            fontWeight: 700
                        }}
                    >
                        <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                        SOC2 Type II
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.75,
                            fontWeight: 700
                        }}
                    >
                        <VpnKeyOutlinedIcon sx={{ fontSize: 16 }} />
                        SSO Ready
                    </Typography> */}
                </Box>
            </Box>
        </Box>
    );
}

export default LoginPage;
