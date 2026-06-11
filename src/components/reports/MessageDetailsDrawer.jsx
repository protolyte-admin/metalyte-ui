import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Chip, Divider, Drawer, Stack, Typography } from "@mui/material";
import StatusTimeline from "./StatusTimeline";
import { formatDateTimeIST } from "../../utils/time";

const statusChipColor = {
    SENT: "info",
    DELIVERED: "success",
    READ: "success",
    FAILED: "error"
};

function DetailRow({ label, value }) {
    return (
        <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                {value ?? "—"}
            </Typography>
        </Box>
    );
}

export default function MessageDetailsDrawer({ message, onClose }) {
    const open = Boolean(message);

    if (!message) {
        return null;
    }

    const timelineHistory = message.statusHistory || [];

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: {
                        xs: "100%",
                        sm: 560
                    },
                    bgcolor: "background.paper"
                }
            }}
        >
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                        <Typography variant="h6">Message Details</Typography>
                        <Typography color="text.secondary" variant="body2">
                            Full payload and delivery history.
                        </Typography>
                    </Box>
                    <Button
                        onClick={onClose}
                        startIcon={<CloseIcon />}
                        color="inherit"
                        sx={{ minWidth: 0, px: 0 }}
                    />
                </Box>
                <Divider />
                <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
                    <Stack spacing={2}>
                        <DetailRow label="Message ID" value={message.id ?? message.messageId} />
                        <DetailRow label="WhatsApp Message ID" value={message.whatsappMessageId} />
                        <DetailRow label="Contact ID" value={message.contactId} />
                        <DetailRow label="Campaign ID" value={message.campaignId} />
                        <DetailRow label="Template Name" value={message.templateName} />
                        <DetailRow label="Message Type" value={message.messageType} />
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Current Status
                            </Typography>
                            <Chip
                                label={message.currentStatus || "—"}
                                color={statusChipColor[message.currentStatus] || "default"}
                                size="small"
                            />
                        </Box>
                        <DetailRow label="Sent Time" value={formatDateTimeIST(message.sentAt)} />
                        <DetailRow label="Delivered Time" value={formatDateTimeIST(message.deliveredAt)} />
                        <DetailRow label="Read Time" value={formatDateTimeIST(message.readAt)} />
                        <DetailRow label="Failed Time" value={formatDateTimeIST(message.failedAt)} />
                        <DetailRow label="Failure Reason" value={message.failureReason} />
                        <DetailRow label="Created At" value={formatDateTimeIST(message.createdAt)} />
                        <DetailRow label="Updated At" value={formatDateTimeIST(message.updatedAt)} />
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Message Body
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                {message.body ?? message.messageBody ?? "—"}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Status History
                            </Typography>
                            <StatusTimeline history={timelineHistory} />
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Drawer>
    );
}
