import { Button, Card, Col, Progress, Row, Space, Statistic, Table, Tag, Typography } from "antd";
import {
    ApiOutlined,
    BarChartOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CrownOutlined,
    DownloadOutlined,
    EyeOutlined,
    MessageOutlined,
    TeamOutlined,
    WalletOutlined,
    CustomerServiceOutlined
} from "@ant-design/icons";

import { tokens } from "../theme/tokens";

const billingStats = [
    { label: "Total Amount", value: "₹4,999.00", helper: "For this billing cycle", icon: <WalletOutlined />, color: tokens.colors.primary },
    { label: "Bills Paid", value: "₹3,499.00", helper: "2 invoices", icon: <CheckCircleOutlined />, color: tokens.colors.success },
    { label: "Pending to Pay", value: "₹1,500.00", helper: "1 invoice", icon: <ClockCircleOutlined />, color: tokens.colors.warning },
    { label: "Next Billing Date", value: "01 Feb 2026", helper: "Automatically billed", icon: <CalendarOutlined />, color: tokens.colors.primaryHover }
];

const invoices = [
    { id: "INV-2026-00031", date: "01 Jan 2026", description: "Metalyte Business Plan - Jan 2026", period: "01 Jan 2026 - 31 Jan 2026", amount: "₹1,500.00", status: "Pending" },
    { id: "INV-2025-00028", date: "01 Dec 2025", description: "Metalyte Business Plan - Dec 2025", period: "01 Dec 2025 - 31 Dec 2025", amount: "₹1,749.00", status: "Paid" },
    { id: "INV-2025-00025", date: "01 Nov 2025", description: "Metalyte Business Plan - Nov 2025", period: "01 Nov 2025 - 30 Nov 2025", amount: "₹1,749.00", status: "Paid" }
];

const planFeatures = [
    { label: "Unlimited Contacts", icon: <TeamOutlined /> },
    { label: "Unlimited Messages", icon: <MessageOutlined /> },
    { label: "Advanced Analytics", icon: <BarChartOutlined /> },
    { label: "Priority Support", icon: <CustomerServiceOutlined /> },
    { label: "API Access", icon: <ApiOutlined /> }
];

function StatCard({ stat }) {
    return (
        <Card className="billing-stat-card" bordered>
            <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
                <Statistic
                    title={stat.label}
                    value={stat.value}
                    valueStyle={{ color: stat.color, fontWeight: 900, fontSize: 26 }}
                />
                <div className="billing-stat-icon" style={{ color: stat.color, background: `${stat.color}22` }}>
                    {stat.icon}
                </div>
            </Space>
            <Typography.Text type="secondary">{stat.helper}</Typography.Text>
        </Card>
    );
}

function SubscriptionCard() {
    return (
        <Card className="billing-subscription-card" bordered>
            <Typography.Title level={3}>Current Subscription</Typography.Title>
            <Space size={16} align="center" style={{ marginBottom: 24 }}>
                <div className="billing-plan-icon"><CrownOutlined /></div>
                <div>
                    <Typography.Text strong style={{ fontSize: 17 }}>Business Plan</Typography.Text>
                    <br />
                    <Tag color="processing" style={{ marginTop: 8 }}>Monthly</Tag>
                </div>
            </Space>

            <Typography.Title level={2} style={{ marginBottom: 4 }}>
                ₹1,749 <Typography.Text type="secondary" style={{ fontSize: 16 }}>/ month</Typography.Text>
            </Typography.Title>
            <Typography.Text type="secondary">Billed monthly</Typography.Text>
            <br />
            <Typography.Text type="secondary">Next billing on 01 Feb 2026</Typography.Text>

            <div className="billing-divider" />

            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {planFeatures.map((feature) => (
                    <Space key={feature.label} size={12}>
                        <span className="billing-feature-icon">{feature.icon}</span>
                        <Typography.Text>{feature.label}</Typography.Text>
                    </Space>
                ))}
            </Space>

            <div className="billing-divider" />

            <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 12 }}>
                <Typography.Text strong>Plan Usage</Typography.Text>
                <Typography.Text type="secondary">This billing cycle</Typography.Text>
            </Space>
            <Progress percent={84} showInfo={false} strokeColor={tokens.colors.primary} trailColor="rgba(255,255,255,0.12)" />
            <Space style={{ width: "100%", justifyContent: "space-between", marginTop: 8 }}>
                <Typography.Text type="secondary">8,450 / 10,000 messages</Typography.Text>
                <Typography.Text type="secondary">84%</Typography.Text>
            </Space>
            <Button type="primary" block size="large" style={{ marginTop: 24, fontWeight: 800 }}>
                Change Plan
            </Button>
        </Card>
    );
}

export default function BillingPage() {
    const columns = [
        { title: "Invoice #", dataIndex: "id", key: "id", width: 160 },
        { title: "Date", dataIndex: "date", key: "date", width: 140 },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (_, invoice) => (
                <div>
                    <Typography.Text strong>{invoice.description}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">{invoice.period}</Typography.Text>
                </div>
            )
        },
        { title: "Amount", dataIndex: "amount", key: "amount", width: 130 },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status) => (
                <Tag color={status === "Paid" ? "success" : "warning"} icon={status === "Paid" ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
                    {status}
                </Tag>
            )
        },
        {
            title: "Action",
            key: "action",
            width: 110,
            render: () => (
                <Space>
                    <Button type="text" icon={<DownloadOutlined />} />
                    <Button type="text" icon={<EyeOutlined />} />
                </Space>
            )
        }
    ];

    return (
        <div className="billing-page">
            <div className="page-header-row billing-header-row">
                <div>
                    <Typography.Title level={1} className="page-title">Billing & Subscription</Typography.Title>
                    <Typography.Text type="secondary">Manage your billing, invoices and subscription plan.</Typography.Text>
                </div>
            </div>

            <div className="billing-tabs">
                <button type="button" className="active">Billing</button>
                <button type="button">Subscription</button>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} xl={17}>
                    <Space className="billing-cycle-heading" align="start">
                        <div>
                            <Typography.Title level={3}>Current billing cycle</Typography.Title>
                            <Typography.Text type="secondary">01 Jan 2026 - 31 Jan 2026 (30 days)</Typography.Text>
                        </div>
                        <Tag icon={<ClockCircleOutlined />} color="default">15 days left in cycle</Tag>
                    </Space>

                    <Row gutter={[16, 16]}>
                        {billingStats.map((stat) => (
                            <Col xs={24} md={12} lg={6} key={stat.label}>
                                <StatCard stat={stat} />
                            </Col>
                        ))}
                    </Row>

                    <Card
                        title={
                            <div>
                                <Typography.Text strong>Invoices</Typography.Text>
                                <br />
                                <Typography.Text type="secondary">View and download your invoices</Typography.Text>
                            </div>
                        }
                        extra={<Button icon={<DownloadOutlined />}>Download All</Button>}
                        className="billing-invoices-card"
                        bordered
                    >
                        <Table
                            rowKey="id"
                            columns={columns}
                            dataSource={invoices}
                            pagination={{ pageSize: 10, hideOnSinglePage: true }}
                            scroll={{ x: 900 }}
                        />
                    </Card>
                </Col>

                <Col xs={24} xl={7}>
                    <SubscriptionCard />
                </Col>
            </Row>
        </div>
    );
}