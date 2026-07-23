import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircle";
import CrownIcon from "@mui/icons-material/WorkspacePremium";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ApiOutlinedIcon from "@mui/icons-material/ApiOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SideNav from "../components/layout/SideNav";
import TopBar from "../components/layout/TopBar";

const billingStats = [
    {
        label: "Total Amount",
        value: "₹4,999.00",
        helper: "For this billing cycle",
        icon: <AccountBalanceWalletOutlinedIcon />,
        color: "#2F18F6"
    },
    {
        label: "Bills Paid",
        value: "₹3,499.00",
        helper: "2 invoices",
        icon: <CheckCircleOutlineIcon />,
        color: "#00C781"
    },
    {
        label: "Pending to Pay",
        value: "₹1,500.00",
        helper: "1 invoice",
        icon: <AccessTimeOutlinedIcon />,
        color: "#F5A524"
    },
    {
        label: "Next Billing Date",
        value: "01 Feb 2026",
        helper: "Automatically billed",
        icon: <CalendarMonthOutlinedIcon />,
        color: "#432DFF"
    }
];

const invoices = [
    {
        id: "INV-2026-00031",
        date: "01 Jan 2026",
        description: "Metalyte Business Plan - Jan 2026",
        period: "01 Jan 2026 - 31 Jan 2026",
        amount: "₹1,500.00",
        status: "Pending"
    },
    {
        id: "INV-2025-00028",
        date: "01 Dec 2025",
        description: "Metalyte Business Plan - Dec 2025",
        period: "01 Dec 2025 - 31 Dec 2025",
        amount: "₹1,749.00",
        status: "Paid"
    },
    {
        id: "INV-2025-00025",
        date: "01 Nov 2025",
        description: "Metalyte Business Plan - Nov 2025",
        period: "01 Nov 2025 - 30 Nov 2025",
        amount: "₹1,749.00",
        status: "Paid"
    }
];

const planFeatures = [
    { label: "Unlimited Contacts", icon: <PeopleAltOutlinedIcon /> },
    { label: "Unlimited Messages", icon: <ChatBubbleOutlineOutlinedIcon /> },
    { label: "Advanced Analytics", icon: <BarChartOutlinedIcon /> },
    { label: "Priority Support", icon: <SupportAgentOutlinedIcon /> },
    { label: "API Access", icon: <ApiOutlinedIcon /> }
];

function StatCard({ stat }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                minHeight: 128,
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "#0B1324"
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: "#BBC3D8", fontSize: 14, mb: 1.2 }}>
                        {stat.label}
                    </Typography>
                    <Typography sx={{ color: stat.color, fontSize: 27, fontWeight: 900 }}>
                        {stat.value}
                    </Typography>
                    <Typography sx={{ color: "#A8B2CC", fontSize: 14, mt: 1.4 }}>
                        {stat.helper}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        color: stat.color,
                        bgcolor: `${stat.color}22`,
                        flex: "0 0 auto"
                    }}
                >
                    {stat.icon}
                </Box>
            </Box>
        </Paper>
    );
}

function StatusChip({ status }) {
    const paid = status === "Paid";
    return (
        <Chip
            size="small"
            icon={paid ? <CheckCircleOutlineIcon /> : <AccessTimeOutlinedIcon />}
            label={status}
            sx={{
                bgcolor: paid ? "rgba(0,199,129,0.15)" : "rgba(245,165,36,0.16)",
                color: paid ? "#00C781" : "#F5A524",
                fontWeight: 800,
                "& .MuiChip-icon": {
                    color: "inherit"
                }
            }}
        />
    );
}

function InvoicesTable() {
    return (
        <Paper
            elevation={0}
            sx={{
                mt: 4,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "#0B1324"
            }}
        >
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2
                }}
            >
                <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: 18 }}>Invoices</Typography>
                    <Typography sx={{ color: "#BBC3D8", mt: 0.5 }}>
                        View and download your invoices
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<DownloadOutlinedIcon />}
                    sx={{ color: "#FFFFFF", borderColor: "rgba(255,255,255,0.12)" }}
                >
                    Download All
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                            {["Invoice #", "Date", "Description", "Amount", "Status", "Action"].map((label) => (
                                <TableCell key={label} sx={{ color: "#BBC3D8", fontWeight: 900, fontSize: 12, letterSpacing: 1 }}>
                                    {label.toUpperCase()}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id} sx={{ "& td": { borderColor: "rgba(255,255,255,0.06)" } }}>
                                <TableCell sx={{ color: "#FFFFFF", fontWeight: 700 }}>{invoice.id}</TableCell>
                                <TableCell sx={{ color: "#FFFFFF" }}>{invoice.date}</TableCell>
                                <TableCell>
                                    <Typography sx={{ color: "#FFFFFF", fontWeight: 700 }}>{invoice.description}</Typography>
                                    <Typography sx={{ color: "#BBC3D8", fontSize: 13 }}>{invoice.period}</Typography>
                                </TableCell>
                                <TableCell sx={{ color: "#FFFFFF", fontWeight: 800 }}>{invoice.amount}</TableCell>
                                <TableCell><StatusChip status={invoice.status} /></TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.04)", borderRadius: 1.5 }}>
                                            <DownloadOutlinedIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.04)", borderRadius: 1.5 }}>
                                            <VisibilityOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#BBC3D8" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Show</Typography>
                    <Button variant="outlined" endIcon={<ChevronRightIcon sx={{ transform: "rotate(90deg)" }} />} sx={{ minWidth: 58, color: "#FFFFFF", borderColor: "rgba(255,255,255,0.12)" }}>10</Button>
                    <Typography>entries</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.04)", borderRadius: 1.5 }}><ChevronLeftIcon /></IconButton>
                    <Box sx={{ width: 36, height: 36, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "#2F18F6", fontWeight: 900 }}>1</Box>
                    <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.04)", borderRadius: 1.5 }}><ChevronRightIcon /></IconButton>
                </Box>
            </Box>
        </Paper>
    );
}

function SubscriptionCard() {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "#0B1324",
                height: "fit-content"
            }}
        >
            <Typography sx={{ fontSize: 18, fontWeight: 900, mb: 3 }}>Current Subscription</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: "#2F18F6", display: "grid", placeItems: "center" }}>
                    <CrownIcon sx={{ fontSize: 38 }} />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: 17, fontWeight: 900 }}>Business Plan</Typography>
                    <Chip label="Monthly" size="small" sx={{ mt: 1, bgcolor: "rgba(47,24,246,0.22)", color: "#D8D4FF", fontWeight: 800 }} />
                </Box>
            </Box>
            <Typography sx={{ fontSize: 30, fontWeight: 900, mb: 1 }}>₹1,749 <Box component="span" sx={{ color: "#BBC3D8", fontSize: 16, fontWeight: 500 }}>/ month</Box></Typography>
            <Typography sx={{ color: "#BBC3D8" }}>Billed monthly</Typography>
            <Typography sx={{ color: "#BBC3D8", mt: 1 }}>Next billing on 01 Feb 2026</Typography>
            <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.08)" }} />
            <Box sx={{ display: "grid", gap: 1.5 }}>
                {planFeatures.map((feature) => (
                    <Box key={feature.label} sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#FFFFFF" }}>
                        <Box sx={{ color: "#D8D4FF", display: "flex" }}>{feature.icon}</Box>
                        <Typography>{feature.label}</Typography>
                    </Box>
                ))}
            </Box>
            <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.08)" }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontWeight: 900 }}>Plan Usage</Typography>
                <Typography sx={{ color: "#BBC3D8" }}>This billing cycle</Typography>
            </Box>
            <LinearProgress variant="determinate" value={84} sx={{ height: 9, borderRadius: 99, bgcolor: "rgba(255,255,255,0.12)", "& .MuiLinearProgress-bar": { bgcolor: "#2F18F6" } }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5, color: "#BBC3D8" }}>
                <Typography>8,450 / 10,000 messages</Typography>
                <Typography>84%</Typography>
            </Box>
            <Button fullWidth variant="contained" sx={{ mt: 3, minHeight: 52, bgcolor: "#2F18F6", fontWeight: 900 }}>
                Change Plan
            </Button>
        </Paper>
    );
}

export default function BillingPage() {
    return (
        <Box sx={{ height: "100vh", display: "flex", background: "background.default", overflow: "hidden" }}>
            <SideNav />
            <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <TopBar onNewMessage={() => {}} />
                <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                            Billing & Subscription
                        </Typography>
                        <Typography sx={{ color: "#BBC3D8" }}>
                            Manage your billing, invoices and subscription plan.
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.08)", mb: 3 }}>
                        <Box sx={{ color: "#7B6DFF", fontWeight: 900, pb: 1.5, borderBottom: "2px solid #2F18F6" }}>Billing</Box>
                        <Box sx={{ color: "#74809E", fontWeight: 800, pb: 1.5 }}>Subscription</Box>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1fr 360px" }, gap: 3 }}>
                        <Box sx={{ minWidth: 0 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 2 }}>
                                <Box>
                                    <Typography sx={{ fontSize: 20, fontWeight: 900 }}>Current billing cycle</Typography>
                                    <Typography sx={{ color: "#BBC3D8", mt: 0.6 }}>01 Jan 2026 - 31 Jan 2026 (30 days)</Typography>
                                </Box>
                                <Chip icon={<AccessTimeOutlinedIcon />} label="15 days left in cycle" sx={{ bgcolor: "rgba(255,255,255,0.04)", color: "#FFFFFF", fontWeight: 800 }} />
                            </Box>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }, gap: 2 }}>
                                {billingStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
                            </Box>
                            <InvoicesTable />
                        </Box>
                        <SubscriptionCard />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

