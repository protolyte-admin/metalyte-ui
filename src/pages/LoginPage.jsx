import { Box, CardContent, Link, Typography } from "@mui/material";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";
import BrandLogo from "../components/common/BrandLogo";
import MarqCard from "../components/common/MarqCard";
import { useAuth } from "../context/useAuth";
import { login } from "../services/authService";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn } = useAuth();

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
                py: { xs: 5, md: 7 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "radial-gradient(circle at 12% 12%, rgba(47,24,246,0.18), transparent 26rem), radial-gradient(circle at 88% 18%, rgba(255,255,255,0.07), transparent 21rem), linear-gradient(135deg, #090E1F 0%, #01030A 48%, #050A18 100%)"
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 560 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4.5 }}>
                    <BrandLogo sx={{ width: { xs: 250, sm: 330 }, height: { xs: 82, sm: 110 }, mb: 1.75 }} />
                    <Typography sx={{ color: "text.secondary", mt: 0.75, fontSize: 17 }}>
                        Business Communication Platform
                    </Typography>
                </Box>

                <MarqCard>
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
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

                <Typography color="text.secondary" sx={{ textAlign: "center", mt: 3.5 }}>
                    Don&apos;t have an account?{" "}
                    <Link component="button" underline="none" sx={{ color: "#7B6DFF", fontWeight: 800 }}>
                        Request Access
                    </Link>
                </Typography>

                <Box sx={{ mt: 6, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 3, color: "#74809E" }}>
                    <Typography variant="caption" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontWeight: 700 }}>
                        <SecurityOutlinedIcon sx={{ fontSize: 16 }} />
                        A product from Protolyte Systems
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default LoginPage;