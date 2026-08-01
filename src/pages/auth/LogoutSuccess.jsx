import { Button, Space, Typography } from "antd";
import { CheckCircleOutlined, LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import MarqButton from "../../components/common/MarqButton";
import BrandLogo from "../../components/common/BrandLogo";
import MarqCard from "../../components/common/MarqCard";
import { tokens } from "../../theme/tokens";

export default function LogoutSuccess() {
    const navigate = useNavigate();

    return (
        <main
            className="auth-page auth-page-logout"
            style={{
                minHeight: "100vh",
                width: "100%",
                padding: "56px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "radial-gradient(circle at 86% 7%, rgba(47,24,246,0.08), transparent 23rem), linear-gradient(90deg, #FFFFFF 0%, #F8FAFC 44%, #EEF2FF 100%)"
            }}
        >
            <section style={{ width: "100%", maxWidth: 610 }}>
                <Space direction="vertical" align="center" style={{ width: "100%", marginBottom: 40 }}>
                    <BrandLogo style={{ width: "min(320px, 78vw)" }} />
                </Space>

                <MarqCard>
                    <div style={{ padding: "56px min(56px, 8vw)", textAlign: "center" }}>
                        <div className="auth-success-icon">
                            <CheckCircleOutlined />
                        </div>

                        <Typography.Title level={1} style={{ marginBottom: 16 }}>
                            Securely Logged Out
                        </Typography.Title>

                        <Typography.Paragraph className="auth-logout-copy">
                            You have been successfully logged out of your enterprise session. Thank you for using Metalyte.
                        </Typography.Paragraph>

                        <MarqButton
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/login", { replace: true })}
                            style={{ minHeight: 58, marginBottom: 32, letterSpacing: 1.4 }}
                        >
                            RETURN TO LOGIN
                        </MarqButton>

                        <Typography.Text style={{ color: tokens.colors.textSecondary }}>
                            Need help?{" "}
                            <Button type="link" className="auth-support-link">
                                Contact Support
                            </Button>
                        </Typography.Text>
                    </div>
                </MarqCard>

                <Space align="center" wrap size={32} style={{ width: "100%", justifyContent: "center", marginTop: 48, color: tokens.colors.textMuted }}>
                    <Space size={6}>
                        <SafetyCertificateOutlined />
                        <Typography.Text style={{ color: tokens.colors.textMuted, fontSize: 12 }}>
                            Enterprise Secure
                        </Typography.Text>
                    </Space>
                    <Space size={6}>
                        <LockOutlined />
                        <Typography.Text style={{ color: tokens.colors.textMuted, fontSize: 12 }}>
                            Data Encrypted
                        </Typography.Text>
                    </Space>
                </Space>
            </section>
        </main>
    );
}