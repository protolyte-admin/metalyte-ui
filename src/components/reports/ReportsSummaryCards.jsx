import { Box, Card, Grid, LinearProgress, Stack, Skeleton, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import SendIcon from "@mui/icons-material/Send";

const cardConfigs = [
    {
        key: "totalSent",
        label: "Total Messages Sent",
        field: "totalSent",
        icon: <SendIcon fontSize="large" />
    },
    {
        key: "totalDelivered",
        label: "Total Delivered",
        field: "totalDelivered",
        icon: <CheckCircleIcon fontSize="large" />
    },
    {
        key: "totalRead",
        label: "Total Read",
        field: "totalRead",
        icon: <MarkEmailReadIcon fontSize="large" />
    },
    {
        key: "totalFailed",
        label: "Total Failed",
        field: "totalFailed",
        icon: <ErrorOutlineIcon fontSize="large" />
    },
    {
        key: "deliveryRate",
        label: "Delivery Rate",
        field: "deliveryRate",
        progress: true
    },
    {
        key: "readRate",
        label: "Read Rate",
        field: "readRate",
        progress: true
    },
    {
        key: "messagesSentToday",
        label: "Messages Sent Today",
        field: "messagesSentToday"
    },
    {
        key: "messagesDeliveredToday",
        label: "Delivered Today",
        field: "messagesDeliveredToday"
    },
    {
        key: "messagesReadToday",
        label: "Read Today",
        field: "messagesReadToday"
    }
];

function SummaryCard({ title, value, icon, progress, loading }) {
    const displayValue = progress && typeof value === "number" ? `${value}%` : value;

    return (
        <Card
            elevation={0}
            sx={{
                p: 3,
                minHeight: 152,
                transition: "transform 180ms ease, box-shadow 180ms ease",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                '&:hover': {
                    transform: "translateY(-4px)",
                    boxShadow: "0 18px 44px rgba(0,0,0,0.16)"
                }
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                        {loading ? <Skeleton width={96} /> : displayValue ?? "--"}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.05)",
                        color: "primary.main"
                    }}
                >
                    {loading ? <Skeleton width={24} height={24} /> : icon}
                </Box>
            </Stack>
            {progress ? (
                loading ? (
                    <Skeleton variant="rounded" height={8} sx={{ mt: 3, borderRadius: 2 }} />
                ) : (
                    <Box sx={{ mt: 3 }}>
                        <LinearProgress
                            variant="determinate"
                            value={Number(value) || 0}
                            sx={{ height: 8, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.08)" }}
                        />
                    </Box>
                )
            ) : null}
        </Card>
    );
}

export default function ReportsSummaryCards({ summary, loading }) {
    const isEmpty = !summary && !loading;

    return (
        <Grid container spacing={2}>
            {cardConfigs.map((config) => {
                const value = summary ? summary[config.field] : null;
                return (
                    <Grid key={config.key} item xs={12} sm={6} md={4}>
                        <SummaryCard
                            title={config.label}
                            value={value}
                            icon={config.icon}
                            progress={config.progress}
                            loading={loading}
                        />
                    </Grid>
                );
            })}
            {isEmpty && (
                <Grid item xs={12}>
                    <Typography color="text.secondary" sx={{ pt: 2, textAlign: "center" }}>
                        No summary data available for the selected filters.
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
}
