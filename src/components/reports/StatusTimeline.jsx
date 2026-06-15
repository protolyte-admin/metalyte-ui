import { Box, Chip, Typography } from "@mui/material";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import { formatDateTimeIST, formatRelativeShortIST, parseTimestamp } from "../../utils/time";

const statusColorMap = {
    SENT: "info",
    DELIVERED: "success",
    READ: "success",
    FAILED: "error"
};

const RECENT_THRESHOLD_MS = 24 * 60 * 60 * 1000;

function formatTimestamp(value, now) {
    const parsed = parseTimestamp(value);
    if (!parsed) return "";
    if (now && Math.abs(now.getTime() - parsed.getTime()) < RECENT_THRESHOLD_MS) {
        return formatRelativeShortIST(parsed, now);
    }
    return formatDateTimeIST(parsed);
}

export default function StatusTimeline({ history, now = new Date() }) {
    const items = Array.isArray(history) ? history : [];

    if (!items.length) {
        return (
            <Typography color="text.secondary" variant="body2">
                No status history is available for this message.
            </Typography>
        );
    }

    return (
        <Timeline position="left" sx={{ p: 0, m: 0, "& .MuiTimelineItem-root::before": { display: "none" } }}>
            {items.map((event, index) => (
                <TimelineItem key={`${event.status}-${event.timestamp}-${index}`}>
                    <TimelineSeparator>
                        <TimelineDot color={statusColorMap[event.status] || "primary"} />
                        {index < items.length - 1 ? <TimelineConnector /> : null}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: 0.75, pl: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Chip
                                label={event.status}
                                color={statusColorMap[event.status] || "primary"}
                                size="small"
                                sx={{ textTransform: "capitalize", fontWeight: 600 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {formatTimestamp(event.timestamp, now)}
                            </Typography>
                        </Box>
                        {event.description ? (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {event.description}
                            </Typography>
                        ) : null}
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}
