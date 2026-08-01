import { Card, Col, Empty, Progress, Row, Skeleton, Space, Tag, Tooltip, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, MailOutlined, SendOutlined } from "@ant-design/icons";

import { formatDateTimeIST } from "../../utils/time";
import { tokens } from "../../theme/tokens";

function rateBand(value, { invert = false } = {}) {
    if (value == null || Number.isNaN(Number(value))) return { label: "No data", color: "default" };
    const v = Number(value);
    const good = invert ? v < 5 : v >= 90;
    const watch = invert ? v < 15 : v >= 70;
    if (good) return { label: "Healthy", color: "success" };
    if (watch) return { label: "Watch", color: "warning" };
    return { label: "Critical", color: "error" };
}

const lifetimeCards = [
    { key: "totalSent", label: "Total Messages Sent", field: "totalSent", icon: <SendOutlined />, accent: tokens.colors.primary },
    { key: "totalDelivered", label: "Total Delivered", field: "totalDelivered", icon: <CheckCircleOutlined />, accent: tokens.colors.success },
    { key: "totalRead", label: "Total Read", field: "totalRead", icon: <MailOutlined />, accent: tokens.colors.success },
    { key: "totalFailed", label: "Total Failed", field: "totalFailed", icon: <CloseCircleOutlined />, accent: tokens.colors.danger },
    { key: "deliveryRate", label: "Delivery Rate", field: "deliveryRate", progress: true, rateInvert: false, accent: tokens.colors.primary },
    { key: "readRate", label: "Read Rate", field: "readRate", progress: true, rateInvert: false, accent: tokens.colors.primary },
    { key: "failureRate", label: "Failure Rate", field: "failureRate", progress: true, rateInvert: true, accent: tokens.colors.danger }
];

const todayCards = [
    { key: "messagesSentToday", label: "Sent Today", field: "messagesSentToday", accent: tokens.colors.primary },
    { key: "messagesDeliveredToday", label: "Delivered Today", field: "messagesDeliveredToday", accent: tokens.colors.success },
    { key: "messagesReadToday", label: "Read Today", field: "messagesReadToday", accent: tokens.colors.success }
];

function formatValue(value, progress) {
    if (value === null || value === undefined) return "--";
    if (progress) {
        const n = Number(value);
        if (!Number.isFinite(n)) return "--";
        return `${n.toFixed(n < 10 ? 1 : 0)}%`;
    }
    if (typeof value === "number") return new Intl.NumberFormat("en-IN").format(value);
    return String(value);
}

function bandColor(band) {
    if (band.color === "success") return "success";
    if (band.color === "warning") return "warning";
    if (band.color === "error") return "error";
    return "default";
}

function SummaryCard({ config, value, loading }) {
    const { label, icon, progress, accent, rateInvert } = config;
    const band = progress ? rateBand(value, { invert: rateInvert }) : null;
    const displayValue = formatValue(value, progress);
    const numericValue = Math.max(0, Math.min(100, Number(value) || 0));

    return (
        <Card className="reports-summary-card" bordered style={{ borderLeftColor: accent }}>
            <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
                <div style={{ minWidth: 0 }}>
                    <Typography.Text type="secondary">{label}</Typography.Text>
                    <Typography.Title level={3} style={{ marginTop: 8, marginBottom: 0 }}>
                        {loading ? <Skeleton.Input active size="small" style={{ width: 90 }} /> : displayValue}
                    </Typography.Title>
                    {progress && !loading ? <Tag color={bandColor(band)} style={{ marginTop: 8 }}>{band.label}</Tag> : null}
                </div>
                {icon ? <div className="reports-summary-icon" style={{ color: accent }}>{loading ? <Skeleton.Avatar active size="small" /> : icon}</div> : null}
            </Space>
            {progress ? (
                loading ? <Skeleton.Input active size="small" block style={{ marginTop: 16 }} /> : (
                    <Tooltip title={`${displayValue} of sent messages`}>
                        <Progress percent={numericValue} showInfo={false} strokeColor={accent} trailColor="#EEF2F7" style={{ marginTop: 16 }} />
                    </Tooltip>
                )
            ) : null}
        </Card>
    );
}

function SectionHeader({ title, updatedAt }) {
    return (
        <div className="reports-section-header">
            <Typography.Text className="page-eyebrow">{title}</Typography.Text>
            {updatedAt ? (
                <Space size={6}>
                    <ClockCircleOutlined />
                    <Typography.Text type="secondary">Updated {formatDateTimeIST(updatedAt)}</Typography.Text>
                </Space>
            ) : null}
        </div>
    );
}

export default function ReportsSummaryCards({ summary, summaryHasData, loading, error, updatedAt }) {
    const summaryData = summary?.data ?? summary;

    if (error && !loading) {
        return (
            <Card className="reports-error-card" bordered>
                <CloseCircleOutlined style={{ color: tokens.colors.danger, fontSize: 34 }} />
                <Typography.Title level={4} type="danger">Could not load summary</Typography.Title>
                <Typography.Text type="secondary">{error}</Typography.Text>
            </Card>
        );
    }

    return (
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <div>
                <SectionHeader title="Lifetime" updatedAt={updatedAt} />
                <Row gutter={[16, 16]}>
                    {lifetimeCards.map((config) => (
                        <Col xs={24} sm={12} md={8} xl={config.progress ? 8 : 6} key={config.key}>
                            <SummaryCard config={config} value={summaryData ? summaryData[config.field] : null} loading={loading} />
                        </Col>
                    ))}
                </Row>
            </div>

            <div>
                <SectionHeader title="Today" />
                <Row gutter={[16, 16]}>
                    {todayCards.map((config) => (
                        <Col xs={24} sm={12} md={8} key={config.key}>
                            <SummaryCard config={config} value={summaryData ? summaryData[config.field] : null} loading={loading} />
                        </Col>
                    ))}
                </Row>
            </div>

            {!loading && !summaryHasData ? <Empty description="No activity for the selected filters yet." /> : null}
        </Space>
    );
}