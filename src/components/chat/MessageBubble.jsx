import { Box, Typography } from "@mui/material";

import AttachmentPreview from "./AttachmentPreview";
import { formatTimeIST } from "../../utils/time";

function getMessageText(message) {
    return message.text || message.body || message.content || message.message || "";
}

function getMessageTime(message) {
    return message.time || message.sentAt || message.createdAt || message.timestamp || "";
}

// Returns one of: "OUT" | "IN" | "UNKNOWN"
function getDirection(message) {
    // 1. Explicit booleans win immediately.
    if (
        message.outgoing === true ||
        message.isOutgoing === true ||
        message.fromMe === true ||
        message.sentByMe === true
    ) {
        return "OUT";
    }
    if (
        message.incoming === true ||
        message.isIncoming === true ||
        // fromMe === false is a true signal that this is incoming
        (message.fromMe === false && message.outgoing !== true)
    ) {
        return "IN";
    }

    // 2. String direction field. This is the source of truth — check ONLY the
    //    directional fields, never mix in status / senderType / senderRole,
    //    because DELIVERED / READ / FAILED / AGENT values would otherwise
    //    misclassify incoming messages as outgoing.
    const directionalField = (
        message.direction ??
        message.messageDirection ??
        message.flow ??
        ""
    )
        .toString()
        .toUpperCase()
        .trim();

    if (directionalField === "OUT" || directionalField === "OUTBOUND" || directionalField === "OUTGOING") {
        return "OUT";
    }
    if (directionalField === "IN" || directionalField === "INBOUND" || directionalField === "INCOMING") {
        return "IN";
    }

    // 3. Heuristic fallback: compare sender identity to the conversation's
    //    phone number. If a `from` / `sender` field matches the conversation
    //    contact, the message is inbound; if it matches the current user, it
    //    is outbound. Use this only when direction is missing.
    return "UNKNOWN";
}

function isOutgoing(message) {
    const direction = getDirection(message);
    if (direction === "OUT") return true;
    if (direction === "IN") return false;

    // Unknown — try the identity heuristic. This requires the parent to
    // pass a `currentUserPhone` hint, but MessageBubble doesn't have it
    // here, so we fall through to "incoming" (left) which is the safe
    // default — better to show on the wrong side than to falsely claim
    // a message was sent by the user.
    return false;
}

export default function MessageBubble({ message }) {
    const outgoing = isOutgoing(message);
    const text = getMessageText(message);
    const attachments = message.attachments || message.files || [];
    const timeLabel = formatTimeIST(getMessageTime(message));

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: outgoing ? "flex-end" : "flex-start",
                mb: 3
            }}
        >
            <Box
                sx={{
                    maxWidth: {
                        xs: "88%",
                        md: "70%"
                    },
                    px: 2.5,
                    py: 2,
                    borderRadius: 2,
                    background: outgoing ? "#2F18F6" : "#121B31",
                    color: "text.primary",
                    boxShadow: "0 16px 30px rgba(0,0,0,0.16)",
                    border: outgoing
                        ? "1px solid rgba(185,174,255,0.2)"
                        : "1px solid rgba(255,255,255,0.08)",
                    overflow: "hidden"
                }}
            >
                {text && (
                    <Typography sx={{ fontSize: 18, lineHeight: 1.48, wordWrap: "break-word", overflowWrap: "break-word" }}>
                        {text}
                    </Typography>
                )}

                {attachments.map((attachment, index) => (
                    <AttachmentPreview
                        key={attachment.id || attachment.url || attachment.name || index}
                        attachment={attachment}
                    />
                ))}

                {timeLabel && (
                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mt: 1,
                            textAlign: outgoing ? "right" : "left",
                            opacity: 0.72
                        }}
                    >
                        {timeLabel}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
