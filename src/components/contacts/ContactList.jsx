import {
    Box,
    CircularProgress,
    IconButton,
    Tooltip,
    Typography
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubble";
import { useNavigate } from "react-router-dom";

import MarqAvatar from "../common/MarqAvatar";
import { formatPhoneNumber, getInitials } from "../../utils/format";
import { formatRelativeShortIST, parseTimestamp } from "../../utils/time";

function getContactName(contact) {
    return contact.name || contact.displayName || contact.fullName || "Unnamed contact";
}

function getContactTime(contact) {
    return (
        contact.lastContactedAt ||
        contact.lastMessageAt ||
        contact.updatedAt ||
        contact.createdAt ||
        null
    );
}

function ContactRow({ contact, onOpen }) {
    const navigate = useNavigate();
    const name = getContactName(contact);
    const phone = formatPhoneNumber(contact.phoneNumber);
    const email = contact.email || "";
    const notes = contact.notes || "";
    const updatedAt = getContactTime(contact);
    const timeLabel = updatedAt ? formatRelativeShortIST(updatedAt) : "";

    return (
        <Box
            onClick={() => onOpen?.(contact)}
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "auto 1.4fr 1fr 1.4fr auto auto" },
                alignItems: "center",
                gap: { xs: 1.5, md: 3 },
                px: { xs: 2, md: 3 },
                py: 2,
                cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                transition: "background 120ms ease",
                "&:hover": { background: "rgba(185,174,255,0.04)" }
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                <MarqAvatar size={44}>{getInitials(name)}</MarqAvatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            color: "text.primary",
                            fontWeight: 800,
                            fontSize: 17,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {name}
                    </Typography>
                    {notes && (
                        <Typography
                            sx={{
                                color: "text.secondary",
                                fontSize: 13,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 280
                            }}
                        >
                            {notes}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Typography
                sx={{
                    color: "text.primary",
                    fontSize: 15,
                    fontVariantNumeric: "tabular-nums",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                }}
            >
                {phone || "—"}
            </Typography>

            <Typography
                sx={{
                    color: email ? "text.primary" : "text.secondary",
                    fontSize: 15,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                }}
            >
                {email || "No email"}
            </Typography>

            <Typography
                sx={{
                    color: "text.secondary",
                    fontSize: 14,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                }}
            >
                {parseTimestamp(updatedAt)
                    ? new Intl.DateTimeFormat("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata"
                    }).format(parseTimestamp(updatedAt))
                    : "—"}
            </Typography>

            <Typography
                sx={{
                    color: "text.secondary",
                    fontSize: 13,
                    whiteSpace: "nowrap"
                }}
            >
                {timeLabel}
            </Typography>

            <Tooltip title="Start conversation">
                <IconButton
                    onClick={(event) => {
                        event.stopPropagation();
                        navigate("/", { state: { openPhoneNumber: contact.phoneNumber } });
                    }}
                    sx={{
                        color: "#B9AEFF",
                        "&:hover": { bgcolor: "rgba(185,174,255,0.12)" }
                    }}
                >
                    <ChatBubbleOutlineIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
}

function LoadMoreRow({ visible, hasMore, loadingMore, sentinelRef }) {
    if (!visible) return null;
    return (
        <Box
            ref={sentinelRef}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1.5,
                py: 3,
                color: "text.secondary",
                fontSize: 13
            }}
        >
            {hasMore ? (
                <>
                    <CircularProgress size={16} sx={{ color: "#B9AEFF" }} />
                    <Typography sx={{ fontSize: 13 }}>
                        {loadingMore ? "Loading next page…" : "Scroll to load more"}
                    </Typography>
                </>
            ) : (
                <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                    You’ve reached the end
                </Typography>
            )}
        </Box>
    );
}

export default function ContactList({
    contacts,
    loading,
    onOpen,
    onCreateClick,
    hasMore = false,
    loadingMore = false,
    sentinelRef
}) {
    if (loading) {
        return (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={28} />
            </Box>
        );
    }

    if (!contacts.length) {
        return (
            <Box
                sx={{
                    py: 10,
                    textAlign: "center",
                    border: "1px dashed rgba(255,255,255,0.1)",
                    borderRadius: 2,
                    color: "text.secondary"
                }}
            >
                <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
                    No contacts yet
                </Typography>
                <Typography sx={{ fontSize: 14, mb: 3 }}>
                    Add your first contact to start a conversation.
                </Typography>
                <Box
                    onClick={onCreateClick}
                    sx={{
                        display: "inline-block",
                        px: 2.5,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: "#B9AEFF",
                        color: "#020B1F",
                        fontWeight: 800,
                        cursor: "pointer",
                        fontSize: 14,
                        letterSpacing: 0.6
                    }}
                >
                    + Add contact
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "rgba(8,22,47,0.5)"
            }}
        >
            <Box
                sx={{
                    display: { xs: "none", md: "grid" },
                    gridTemplateColumns: "auto 1.4fr 1fr 1.4fr auto auto",
                    gap: 3,
                    px: 3,
                    py: 1.5,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    color: "text.secondary",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 1.4,
                    textTransform: "uppercase"
                }}
            >
                <Box>Contact</Box>
                <Box>Phone</Box>
                <Box>Email</Box>
                <Box>Updated</Box>
                <Box>Last seen</Box>
                <Box />
            </Box>

            {contacts.map((contact) => (
                <ContactRow
                    key={contact.id || contact.contactId || contact.phoneNumber}
                    contact={contact}
                    onOpen={onOpen}
                />
            ))}

            <LoadMoreRow
                visible
                hasMore={hasMore}
                loadingMore={loadingMore}
                sentinelRef={sentinelRef}
            />
        </Box>
    );
}
