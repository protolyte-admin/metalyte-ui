import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Chip, Divider, Drawer, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import StatusTimeline from "./StatusTimeline";
import { formatDateTimeIST } from "../../utils/time";
import { formatPhoneNumber } from "../../utils/format";

const statusChipColor = {
    SENT: "info",
    DELIVERED: "success",
    READ: "success",
    FAILED: "error"
};

function CopyableField({ label, value, monospace = false }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return undefined;
        const timer = window.setTimeout(() => setCopied(false), 1500);
        return () => window.clearTimeout(timer);
    }, [copied]);

    const handleCopy = async () => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(String(value));
            setCopied(true);
        } catch {
            // Ignore clipboard failures (insecure context, no permission).
        }
    };

    return (
        <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                {label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                    variant="body2"
                    sx={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        fontFamily: monospace ? "ui-monospace, SFMono-Regular, monospace" : undefined,
                        fontSize: monospace ? 12 : 14,
                        flex: 1
                    }}
                >
                    {value ?? "—"}
                </Typography>
                {value ? (
                    <Tooltip title={copied ? "Copied" : "Copy"} arrow>
                        <IconButton
                            size="small"
                            onClick={handleCopy}
                            sx={{
                                color: copied ? "success.main" : "text.secondary",
                                opacity: 0.4,
                                "&:hover": { opacity: 1 }
                            }}
                        >
                            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                ) : null}
            </Box>
        </Box>
    );
}

function DetailRow({ label, value, monospace = false }) {
    return (
        <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    wordBreak: "break-word",
                    fontFamily: monospace ? "ui-monospace, SFMono-Regular, monospace" : undefined,
                    fontSize: monospace ? 12 : 14
                }}
            >
                {value ?? "—"}
            </Typography>
        </Box>
    );
}

export default function MessageDetailsDrawer({ message, messages = [], onClose, onNavigate }) {
    const open = Boolean(message);

    if (!message) {
        return null;
    }

    const timelineHistory = message.statusHistory || [];
    const currentIndex = messages.findIndex((m) => (m.id ?? m.whatsappMessageId) === (message.id ?? message.whatsappMessageId));
    const canPrev = currentIndex > 0;
    const canNext = currentIndex >= 0 && currentIndex < messages.length - 1;
    const positionLabel = currentIndex >= 0 ? `${currentIndex + 1} of ${messages.length}` : null;

    const handlePrev = () => {
        if (canPrev && onNavigate) onNavigate(currentIndex - 1);
    };
    const handleNext = () => {
        if (canNext && onNavigate) onNavigate(currentIndex + 1);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: {
                        xs: "100%",
                        sm: 580
                    },
                    bgcolor: "background.paper"
                }
            }}
        >
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ p: 3, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Stack
                            spacing={1.5}
                            sx={{
                                mb: 0.5,
                                flexDirection: "row",
                                alignItems: "center",
                                flexWrap: "wrap"
                            }}
                        >
                            <Typography variant="h6">Message Details</Typography>
                            {message.currentStatus ? (
                                <Chip
                                    size="small"
                                    color={statusChipColor[message.currentStatus] || "default"}
                                    label={message.currentStatus.toLowerCase()}
                                    sx={{ textTransform: "capitalize", fontWeight: 600 }}
                                />
                            ) : null}
                        </Stack>
                        <Typography color="text.secondary" variant="body2">
                            Full payload and delivery history.
                        </Typography>
                        {positionLabel ? (
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                                Viewing record {positionLabel} on this page
                            </Typography>
                        ) : null}
                    </Box>
                    <Stack direction="row" spacing={0.5} sx={{ flex: "0 0 auto" }}>
                        <Tooltip title="Previous message" arrow>
                            <span>
                                <IconButton size="small" onClick={handlePrev} disabled={!canPrev}>
                                    <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Next message" arrow>
                            <span>
                                <IconButton size="small" onClick={handleNext} disabled={!canNext}>
                                    <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Close" arrow>
                            <IconButton size="small" onClick={onClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
                    <Stack spacing={2.5}>
                        <CopyableField label="Message ID" value={message.id ?? message.messageId} monospace />
                        <CopyableField label="WhatsApp Message ID" value={message.whatsappMessageId} monospace />
                        <DetailRow label="Contact ID" value={message.contactId} monospace />
                        <DetailRow label="Campaign ID" value={message.campaignId} monospace />
                        <DetailRow label="Template Name" value={message.templateName} />
                        <DetailRow label="Message Type" value={message.messageType} />
                        <DetailRow label="Contact" value={formatPhoneNumber(message.phoneNumber)} />
                        <DetailRow label="Recipient" value={formatPhoneNumber(message.toPhoneNumber)} />
                        <DetailRow label="Sent Time" value={formatDateTimeIST(message.sentAt)} />
                        <DetailRow label="Delivered Time" value={formatDateTimeIST(message.deliveredAt)} />
                        <DetailRow label="Read Time" value={formatDateTimeIST(message.readAt)} />
                        <DetailRow label="Failed Time" value={formatDateTimeIST(message.failedAt)} />
                        <CopyableField label="Failure Reason" value={message.failureReason} />
                        <DetailRow label="Created At" value={formatDateTimeIST(message.createdAt)} />
                        <DetailRow label="Updated At" value={formatDateTimeIST(message.updatedAt)} />
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Message Body
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)"
                                }}
                            >
                                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                    {message.body ?? message.messageBody ?? "—"}
                                </Typography>
                            </Box>
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
