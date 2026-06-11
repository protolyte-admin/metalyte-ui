import { Box, IconButton, Typography } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VideocamIcon from "@mui/icons-material/Videocam";

import MarqAvatar from "../common/MarqAvatar";

function getConversationName(conversation) {
    return (
        conversation?.name ||
        conversation?.displayName ||
        conversation?.contactName ||
        conversation?.phoneNumber ||
        "Select a conversation"
    );
}

export default function ChatHeader({ conversation }) {
    const name = getConversationName(conversation);

    return (
        <Box
            sx={{
                height: 80,
                px: {
                    xs: 2,
                    md: 3
                },
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#020B1F",
                flex: "0 0 auto"
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                {conversation && (
                    <MarqAvatar online={conversation.online !== false} src={conversation.avatarUrl}>
                        {!conversation.avatarUrl && name.slice(0, 1).toUpperCase()}
                    </MarqAvatar>
                )}

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            color: "text.primary",
                            fontWeight: 800,
                            fontSize: 20,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {name}
                    </Typography>
                    {conversation && (
                        <Typography variant="caption" sx={{ color: "#00D26A", fontWeight: 700 }}>
                            Online
                        </Typography>
                    )}
                </Box>
            </Box>

            {conversation && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton aria-label="Call">
                        <CallIcon />
                    </IconButton>
                    <IconButton aria-label="Video call">
                        <VideocamIcon />
                    </IconButton>
                    <IconButton aria-label="More options">
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
}
