import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { formatDayIST, isSameDayIST, parseTimestamp } from "../../utils/time";

function getConversationName(conversation) {
    return (
        conversation?.name ||
        conversation?.displayName ||
        conversation?.contactName ||
        conversation?.phoneNumber ||
        "Contact"
    );
}

function getMessageTime(message) {
    return message.time || message.sentAt || message.createdAt || message.timestamp || null;
}

// Returns the message list in chronological (ascending) order, regardless of
// the order the backend chose to send. We sort defensively so an unsorted
// payload from a future endpoint change can't reorder the chat on the user.
function sortMessagesAsc(messages) {
    return [...messages].sort((a, b) => {
        const ta = parseTimestamp(getMessageTime(a))?.getTime() ?? 0;
        const tb = parseTimestamp(getMessageTime(b))?.getTime() ?? 0;
        if (ta === tb) return 0;
        return ta - tb;
    });
}

export default function ChatBody({
    conversation,
    messages,
    loading
}) {
    const scrollRef = useRef(null);

    const orderedMessages = useMemo(
        () => sortMessagesAsc(messages || []),
        [messages]
    );

    // useLayoutEffect runs synchronously after the DOM is updated but before
    // the browser paints, so the user never sees the messages at scrollTop 0.
    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [orderedMessages, conversation?.phoneNumber]);

    // Also re-snap on window resize so the "latest at bottom" invariant holds
    // when the viewport changes height (e.g. devtools opening).
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onResize = () => {
            el.scrollTop = el.scrollHeight;
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // If the user has scrolled up to read history, we still want to land on
    // the bottom when they switch conversations. The useLayoutEffect above
    // already handles that via the `conversation?.phoneNumber` dep. For new
    // messages within the same conversation, we *only* auto-scroll if the
    // user is already near the bottom — that way incoming messages don't
    // yank them away from older history they're reading.
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            const distanceFromBottom =
                el.scrollHeight - el.scrollTop - el.clientHeight;
            el.dataset.nearBottom = distanceFromBottom < 80 ? "true" : "false";
        };

        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        // Only "follow" the new message if the user is already near the
        // bottom. Otherwise leave their scroll position alone.
        if (el.dataset.nearBottom !== "false") {
            el.scrollTop = el.scrollHeight;
        }
    }, [orderedMessages.length]);

    return (
        <Box
            ref={scrollRef}
            sx={{
                flex: 1,
                minHeight: 0,
                px: {
                    xs: 2,
                    md: 3
                },
                py: 4,
                overflowY: "auto",
                background: "#020B1F"
            }}
        >
            {conversation && orderedMessages.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                    <Box
                        sx={{
                            px: 2,
                            py: 0.75,
                            borderRadius: 99,
                            bgcolor: "#14233C",
                            color: "#8C96B1",
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: 1.5
                        }}
                    >
                        {formatDayIST(getMessageTime(orderedMessages[0]))}
                    </Box>
                </Box>
            )}

            {!conversation && (
                <Box
                    sx={{
                        height: "70%",
                        display: "grid",
                        placeItems: "center",
                        textAlign: "center"
                    }}
                >
                    <Typography sx={{ color: "text.secondary", fontSize: 18 }}>
                        Select a conversation to view messages
                    </Typography>
                </Box>
            )}

            {conversation && loading && (
                <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={30} />
                </Box>
            )}

            {conversation && !loading && orderedMessages.length === 0 && (
                <Box
                    sx={{
                        height: "60%",
                        display: "grid",
                        placeItems: "center",
                        textAlign: "center"
                    }}
                >
                    <Typography sx={{ color: "text.secondary", fontSize: 18 }}>
                        No messages available for this conversation
                    </Typography>
                </Box>
            )}

            {conversation &&
                !loading &&
                orderedMessages.map((message, index) => {
                    const prev = orderedMessages[index - 1];
                    const showSeparator =
                        index === 0 ||
                        !isSameDayIST(
                            getMessageTime(prev),
                            getMessageTime(message)
                        );

                    return (
                        <Box key={message.id || message.messageId || index}>
                            {showSeparator && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        my: 2
                                    }}
                                >
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 99,
                                            bgcolor: "#14233C",
                                            color: "#8C96B1",
                                            fontSize: 11,
                                            fontWeight: 800,
                                            letterSpacing: 1.4
                                        }}
                                    >
                                        {formatDayIST(getMessageTime(message))}
                                    </Box>
                                </Box>
                            )}
                            <MessageBubble message={message} />
                        </Box>
                    );
                })}

            {conversation && !loading && orderedMessages.length > 0 && (
                <TypingIndicator name={getConversationName(conversation)} />
            )}
        </Box>
    );
}
