import { Box, Typography } from "@mui/material";

import MarqAvatar from "../common/MarqAvatar";
import { formatRelativeShortIST, parseTimestamp } from "../../utils/time";

function getConversationName(conversation) {
    return (
        conversation.name ||
        conversation.displayName ||
        conversation.contactName ||
        conversation.phoneNumber ||
        "Unknown contact"
    );
}

function getInitials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getConversationTime(conversation) {
    return (
        conversation.lastMessageTime ||
        conversation.lastMessageAt ||
        conversation.time ||
        conversation.updatedAt ||
        conversation.createdAt ||
        ""
    );
}

function ConversationItem({
    conversation,
    selected,
    onClick
}) {
    const name = getConversationName(conversation);
    const preview =
        conversation.lastMessage ||
        conversation.preview ||
        conversation.message ||
        "No recent messages";
    const timeValue = getConversationTime(conversation);
    const time = timeValue
        ? formatRelativeShortIST(timeValue)
        : "";
    const unread = conversation.unreadCount || conversation.unread || 0;
    const hasValidTime = !!parseTimestamp(timeValue);

    return (
        <Box
            onClick={onClick}
            sx={{
                px: {
                    xs: 2,
                    md: 3
                },
                py: 2.25,
                cursor: "pointer",
                background: selected ? "#1B2A44" : "transparent",
                borderLeft: selected
                    ? "4px solid #B9AEFF"
                    : "4px solid transparent",
                borderBottom: "1px solid rgba(255,255,255,0.035)",
                "&:hover": {
                    background: "#101F38"
                }
            }}
        >
            <Box sx={{ display: "flex", gap: 2, minWidth: 0 }}>
                <MarqAvatar online={Boolean(conversation.online)} src={conversation.avatarUrl}>
                    {!conversation.avatarUrl && getInitials(name)}
                </MarqAvatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1
                        }}
                    >
                        <Typography
                            sx={{
                                color: "text.primary",
                                fontWeight: 800,
                                fontSize: 18,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {name}
                        </Typography>
                        {hasValidTime && (
                            <Typography
                                sx={{
                                    color: "text.secondary",
                                    fontSize: 12,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {time}
                            </Typography>
                        )}
                    </Box>

                    <Typography
                        sx={{
                            color: selected ? "#D8D9EA" : "#9CA4BE",
                            mt: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: 16
                        }}
                    >
                        {preview}
                    </Typography>

                    {Boolean(conversation.tag || unread) && (
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                            {conversation.tag && (
                                <Typography
                                    component="span"
                                    sx={{
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 99,
                                        bgcolor: "rgba(255,255,255,0.12)",
                                        color: "#C3C8DD",
                                        fontSize: 11
                                    }}
                                >
                                    {conversation.tag}
                                </Typography>
                            )}
                            {Boolean(unread) && (
                                <Typography
                                    component="span"
                                    sx={{
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 99,
                                        bgcolor: "#B9AEFF",
                                        color: "#020B1F",
                                        fontSize: 11,
                                        fontWeight: 800
                                    }}
                                >
                                    {unread}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default ConversationItem;
