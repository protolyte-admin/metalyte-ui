import { App, Space, Typography } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";
import BrandLogo from "../components/common/BrandLogo";
import MarqCard from "../components/common/MarqCard";
import { useAuth } from "../context/useAuth";
import { login } from "../services/authService";
import { tokens } from "../theme/tokens";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { message } = App.useApp();
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
            message.error(error?.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="auth-page auth-page-login"
            style={{
                minHeight: "100vh",
                width: "100%",
                padding: "56px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "radial-gradient(circle at 12% 12%, rgba(47,24,246,0.08), transparent 26rem), radial-gradient(circle at 88% 18%, rgba(59,130,246,0.08), transparent 21rem), linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 48%, #EEF2FF 100%)"
            }}
        >
            <section style={{ width: "100%", maxWidth: 560 }}>
                <Space direction="vertical" align="center" size={10} style={{ width: "100%", marginBottom: 36 }}>
                    <BrandLogo style={{ width: "min(330px, 78vw)" }} />
                    <Typography.Text style={{ color: tokens.colors.textSecondary, fontSize: 17 }}>
                        Business Communication Platform
                    </Typography.Text>
                </Space>

                <MarqCard>
                    <div style={{ padding: "40px min(40px, 7vw)" }}>
                        <LoginForm
                            email={email}
                            password={password}
                            loading={loading}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                            onSubmit={handleLogin}
                        />
                    </div>
                </MarqCard>

                <Typography.Paragraph style={{ color: tokens.colors.textSecondary, textAlign: "center", marginTop: 28, marginBottom: 0 }}>
                    Don&apos;t have an account?{" "}
                    <button type="button" className="auth-link-button">
                        Request Access
                    </button>
                </Typography.Paragraph>

                <Space align="center" style={{ width: "100%", justifyContent: "center", marginTop: 48, color: tokens.colors.textMuted }}>
                    <SafetyCertificateOutlined />
                    <Typography.Text style={{ color: tokens.colors.textMuted, fontSize: 12, fontWeight: 700 }}>
                        A product from Protolyte Systems
                    </Typography.Text>
                </Space>
            </section>
        </main>
    );
}

export default LoginPage;