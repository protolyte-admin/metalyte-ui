import { Box, CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useMemo, useState } from "react";

import ConversationItem from "./ConversationItem";
import { getConversations } from "../../api/conversationApi";

function ConversationList({
    selectedConversation,
    setSelectedConversation
}) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        let active = true;

        getConversations()
            .then((response) => {
                const data = response.data.data ?? response.data ?? [];

                if (active) {
                    setConversations(Array.isArray(data) ? data : []);
                }
            })
            .catch((error) => {
                console.error(error);

                if (active) {
                    setConversations([]);
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const filteredConversations = useMemo(() => {
        const value = query.trim().toLowerCase();

        if (!value) {
            return conversations;
        }

        return conversations.filter((conversation) => {
            const name =
                conversation.name ||
                conversation.displayName ||
                conversation.contactName ||
                conversation.phoneNumber ||
                "";
            const lastMessage =
                conversation.lastMessage ||
                conversation.preview ||
                conversation.message ||
                "";

            return `${name} ${lastMessage}`.toLowerCase().includes(value);
        });
    }, [conversations, query]);

    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto"
            }}
        >
            <Box sx={{ px: 2.5, pb: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search messages..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#A8B0D0", fontSize: 19 }} />
                                </InputAdornment>
                            )
                        }
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            height: 44,
                            bgcolor: "#08162F"
                        }
                    }}
                />
            </Box>

            {loading && (
                <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={28} />
                </Box>
            )}

            {!loading && filteredConversations.length === 0 && (
                <Typography
                    sx={{
                        color: "text.secondary",
                        px: 3,
                        py: 4,
                        textAlign: "center"
                    }}
                >
                    No conversations found
                </Typography>
            )}

            {!loading &&
                filteredConversations.map((conversation) => (
                    <ConversationItem
                        key={conversation.id || conversation.phoneNumber}
                        conversation={conversation}
                        selected={
                            selectedConversation?.phoneNumber === conversation.phoneNumber
                        }
                        onClick={() => setSelectedConversation(conversation)}
                    />
                ))}
        </Box>
    );
}

export default ConversationList;
