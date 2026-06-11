import { Box, Typography } from "@mui/material";

import MarqBadge from "../common/MarqBadge";
import ConversationList from "../sidebar/ConversationList";

export default function ConversationPanel({
    selectedConversation,
    setSelectedConversation
}) {
    return (
        <Box
            sx={{
                width: {
                    xs: 300,
                    lg: 480
                },
                maxWidth: "42vw",
                flex: "0 0 auto",
                background: "#020B1F",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                minHeight: 0
            }}
        >
            <Box
                sx={{
                    px: {
                        xs: 2,
                        md: 3
                    },
                    py: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontSize: {
                            xs: 26,
                            md: 32
                        }
                    }}
                >
                    Messages
                </Typography>
                <MarqBadge>12 New</MarqBadge>
            </Box>

            <ConversationList
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
            />
        </Box>
    );
}
