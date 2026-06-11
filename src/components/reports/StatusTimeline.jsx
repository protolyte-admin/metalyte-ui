import { Box, Chip, Typography } from "@mui/material";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import { formatDateTimeIST } from "../../utils/time";

const statusColorMap = {
    SENT: "info",
    DELIVERED: "success",
    READ: "success",
    FAILED: "error"
};

export default function StatusTimeline({ history }) {
    const items = Array.isArray(history) ? history : [];

    if (!items.length) {
        return (
            <Typography color="text.secondary" variant="body2">
                No status history is available for this message.
            </Typography>
        );
    }

    return (
        <Timeline position="right" sx={{ p: 0, m: 0 }}>
            {items.map((event, index) => (
                <TimelineItem key={`${event.status}-${event.timestamp}-${index}`}>
                    <TimelineOppositeContent sx={{ m: 0, pr: 2, textAlign: "right" }}>
                        <Typography variant="body2" color="text.secondary">
                            {formatDateTimeIST(event.timestamp)}
                        </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color={statusColorMap[event.status] || "primary"} />
                        {index < items.length - 1 ? <TimelineConnector /> : null}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: 1, px: 2 }}>
                        <Chip
                            label={event.status}
                            color={statusColorMap[event.status] || "primary"}
                            size="small"
                        />
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}
