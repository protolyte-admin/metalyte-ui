import {
    Box,
    CircularProgress,
    IconButton,
    Tooltip,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
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
        <TableRow
            onClick={() => onOpen?.(contact)}
            sx={{
                cursor: "pointer",
                transition: "background 120ms ease",
                "&:hover": { background: "rgba(185,174,255,0.04)" }
            }}
        >
            <TableCell sx={{ width: 350, minWidth: 350, px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <MarqAvatar size={44}>{getInitials(name)}</MarqAvatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
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
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {notes}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </TableCell>

            <TableCell sx={{ width: 100, minWidth: 100, px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
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
            </TableCell>

            <TableCell sx={{ width: 180, minWidth: 180, px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
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
            </TableCell>

            <TableCell sx={{ width: 160, minWidth: 160, px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
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
            </TableCell>

            <TableCell sx={{ width: 100, minWidth: 100, px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <Typography
                    sx={{
                        color: "text.secondary",
                        fontSize: 13,
                        whiteSpace: "nowrap"
                    }}
                >
                    {timeLabel}
                </Typography>
            </TableCell>

            <TableCell sx={{ width: 40, minWidth: 40, px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
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
            </TableCell>
        </TableRow>
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
        <TableContainer
            sx={{
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 2,
                overflow: "auto",
                bgcolor: "rgba(8,22,47,0.5)",
                height: 600
            }}
        >
            <Table stickyHeader sx={{ minWidth: 930 }}>
                <TableHead>
                    <TableRow sx={{ display: { xs: "none", md: "table-row" } }}>
                        <TableCell sx={{ width: 350, minWidth: 350, px: 3, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)", color: "text.secondary", fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", bgcolor: "#08162F" }}>Contact</TableCell>
                        <TableCell sx={{ width: 100, minWidth: 100, px: 3, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)", color: "text.secondary", fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", bgcolor: "#08162F" }}>Phone</TableCell>
                        <TableCell sx={{ width: 180, minWidth: 180, px: 3, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)", color: "text.secondary", fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", bgcolor: "#08162F" }}>Email</TableCell>
                        <TableCell sx={{ width: 160, minWidth: 160, px: 3, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)", color: "text.secondary", fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", bgcolor: "#08162F" }}>Updated</TableCell>
                        <TableCell sx={{ width: 100, minWidth: 100, px: 3, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)", color: "text.secondary", fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", bgcolor: "#08162F" }}>Last seen</TableCell>
                        <TableCell sx={{ width: 40, minWidth: 40, px: 3, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)", bgcolor: "#08162F" }} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contacts.map((contact) => (
                        <ContactRow
                            key={contact.id || contact.contactId || contact.phoneNumber}
                            contact={contact}
                            onOpen={onOpen}
                        />
                    ))}
                    <TableRow>
                        <TableCell colSpan={6} sx={{ borderBottom: "none", py: 3 }}>
                            <Box
                                ref={sentinelRef}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 1.5,
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
                                        You've reached the end
                                    </Typography>
                                )}
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
