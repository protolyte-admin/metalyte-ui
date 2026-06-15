import { Box, Card, Chip, LinearProgress, Stack, Skeleton, Tooltip, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/Error";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatDateTimeIST } from "../../utils/time";

// Map a rate value (0-100) to a band used for both the bar color and the chip.
function rateBand(value, { invert = false } = {}) {
    if (value == null || Number.isNaN(Number(value))) {
        return { label: "No data", color: "default" };
    }
    const v = Number(value);
    // For failure rate, "good" means low; flip the bands.
    const good = invert ? v < 5 : v >= 90;
    const watch = invert ? v < 15 : v >= 70;
    if (good) return { label: "Healthy", color: "success" };
    if (watch) return { label: "Watch", color: "warning" };
    return { label: "Critical", color: "error" };
}

const lifetimeCards = [
    {
        key: "totalSent",
        label: "Total Messages Sent",
        field: "totalSent",
        icon: <SendIcon fontSize="medium" />,
        accent: "primary"
    },
    {
        key: "totalDelivered",
        label: "Total Delivered",
        field: "totalDelivered",
        icon: <CheckCircleIcon fontSize="medium" />,
        accent: "success"
    },
    {
        key: "totalRead",
        label: "Total Read",
        field: "totalRead",
        icon: <MarkEmailReadIcon fontSize="medium" />,
        accent: "success"
    },
    {
        key: "totalFailed",
        label: "Total Failed",
        field: "totalFailed",
        icon: <ErrorOutlineIcon fontSize="medium" />,
        accent: "error"
    },
    {
        key: "deliveryRate",
        label: "Delivery Rate",
        field: "deliveryRate",
        progress: true,
        rateInvert: false,
        accent: "primary"
    },
    {
        key: "readRate",
        label: "Read Rate",
        field: "readRate",
        progress: true,
        rateInvert: false,
        accent: "primary"
    },
    {
        key: "failureRate",
        label: "Failure Rate",
        field: "failureRate",
        progress: true,
        rateInvert: true,
        accent: "error"
    }
];

const todayCards = [
    {
        key: "messagesSentToday",
        label: "Sent Today",
        field: "messagesSentToday",
        accent: "primary"
    },
    {
        key: "messagesDeliveredToday",
        label: "Delivered Today",
        field: "messagesDeliveredToday",
        accent: "success"
    },
    {
        key: "messagesReadToday",
        label: "Read Today",
        field: "messagesReadToday",
        accent: "success"
    }
];

function formatValue(value, progress) {
    if (value === null || value === undefined) return "--";
    if (progress) {
        const n = Number(value);
        if (!Number.isFinite(n)) return "--";
        return `${n.toFixed(n < 10 ? 1 : 0)}%`;
    }
    if (typeof value === "number") {
        return new Intl.NumberFormat("en-IN").format(value);
    }
    return String(value);
}

function SummaryCard({ config, value, loading }) {
    const { label, icon, progress, accent, rateInvert } = config;
    const band = progress ? rateBand(value, { invert: rateInvert }) : null;
    const displayValue = formatValue(value, progress);

    const accentColor = (theme) => {
        if (accent === "error") return theme.palette.error.main;
        if (accent === "success") return theme.palette.success.main;
        if (accent === "warning") return theme.palette.warning.main;
        return theme.palette.primary.main;
    };

    return (
        <Card
            elevation={0}
            sx={{
                position: "relative",
                p: 2.5,
                minHeight: 150,
                height: "100%",
                transition: "transform 180ms ease, box-shadow 180ms ease",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 4,
                    height: "100%",
                    background: accentColor,
                    opacity: 0.85
                },
                '&:hover': {
                    transform: "translateY(-3px)",
                    boxShadow: "0 18px 44px rgba(0,0,0,0.18)"
                }
            }}
        >
            <Stack
                spacing={1.5}
                sx={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between"
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                        {label}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                        {loading ? <Skeleton width={90} /> : displayValue}
                    </Typography>
                    {progress && !loading ? (
                        <Chip
                            size="small"
                            color={band.color}
                            label={band.label}
                            sx={{ mt: 1, height: 22, fontSize: 11, fontWeight: 700 }}
                        />
                    ) : null}
                </Box>
                {icon ? (
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: 2,
                            background: "rgba(255,255,255,0.05)",
                            color: accentColor,
                            flex: "0 0 auto"
                        }}
                    >
                        {loading ? <Skeleton variant="rounded" width={24} height={24} /> : icon}
                    </Box>
                ) : null}
            </Stack>
            {progress ? (
                loading ? (
                    <Skeleton variant="rounded" height={8} sx={{ mt: 2, borderRadius: 2 }} />
                ) : (
                    <Tooltip title={`${displayValue} of sent messages`} placement="top" arrow>
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={Math.max(0, Math.min(100, Number(value) || 0))}
                                color={band.color === "default" ? "primary" : band.color}
                                sx={{ height: 8, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.08)" }}
                            />
                        </Box>
                    </Tooltip>
                )
            ) : null}
        </Card>
    );
}

function SectionHeader({ title, updatedAt }) {
    return (
        <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 1.5, mt: 0.5 }}>
            <Typography variant="overline" sx={{ letterSpacing: 1.2, color: "text.secondary", fontWeight: 700 }}>
                {title}
            </Typography>
            {updatedAt ? (
                <Typography variant="caption" color="text.secondary" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                    Updated {formatDateTimeIST(updatedAt)}
                </Typography>
            ) : null}
        </Box>
    );
}

export default function ReportsSummaryCards({ summary, summaryHasData, loading, error, updatedAt }) {
    const summaryData = summary?.data ?? summary;

    if (error && !loading) {
        return (
            <Card
                elevation={0}
                sx={{
                    p: 4,
                    textAlign: "center",
                    border: "1px solid rgba(244,67,54,0.32)",
                    background: "rgba(244,67,54,0.06)"
                }}
            >
                <ErrorOutlineIcon color="error" sx={{ fontSize: 36, mb: 1 }} />
                <Typography color="error" variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Could not load summary
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                    {error}
                </Typography>
            </Card>
        );
    }

    return (
        <Stack spacing={3}>
            <Box>
                <SectionHeader title="Lifetime" updatedAt={updatedAt} />
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, minmax(0, 1fr))",
                            md: "repeat(4, minmax(0, 1fr))",
                            xl: "repeat(7, minmax(0, 1fr))"
                        },
                        gap: 2
                    }}
                >
                    {lifetimeCards.map((config) => (
                        <SummaryCard
                            key={config.key}
                            config={config}
                            value={summaryData ? summaryData[config.field] : null}
                            loading={loading}
                        />
                    ))}
                </Box>
            </Box>

            <Box>
                <SectionHeader title="Today" />
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, minmax(0, 1fr))",
                            md: "repeat(3, minmax(0, 1fr))"
                        },
                        gap: 2
                    }}
                >
                    {todayCards.map((config) => (
                        <SummaryCard
                            key={config.key}
                            config={config}
                            value={summaryData ? summaryData[config.field] : null}
                            loading={loading}
                        />
                    ))}
                </Box>
            </Box>

            {!loading && !summaryHasData ? (
                <Typography color="text.secondary" variant="body2" sx={{ textAlign: "center", pt: 1 }}>
                    No activity for the selected filters yet.
                </Typography>
            ) : null}
        </Stack>
    );
}
