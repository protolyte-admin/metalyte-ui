import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import ChatBody from "../components/chat/ChatBody";
import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";
import NewMessageModal from "../components/chat/NewMessageModal";
import ConversationPanel from "../components/conversations/ConversationPanel";
import SideNav from "../components/layout/SideNav";
import TopBar from "../components/layout/TopBar";

import {
    getMessages,
    sendTextMessage
} from "../api/conversationApi";
import sseClient, { useSseEvent } from "../services/sseService";

// True if `message` belongs to the conversation the user is currently viewing.
function messageBelongsToConversation(message, conversation) {
    if (!conversation?.phoneNumber) return false;
    const phone = String(conversation.phoneNumber);
    const candidates = [
        message.phoneNumber,
        message.conversationPhoneNumber,
        message.to,
        message.from,
        message.recipient,
        message.sender
    ];
    return candidates
        .filter(Boolean)
        .map(String)
        .some((value) => value === phone || value.endsWith(phone));
}

export default function InboxPage() {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [composeOpen, setComposeOpen] = useState(false);

    useEffect(() => {
        if (!selectedConversation?.phoneNumber) {
            return;
        }

        let active = true;

        const loadMessages = async () => {
            try {
                setMessagesLoading(true);

                const response = await getMessages(
                    selectedConversation.phoneNumber
                );

                const data =
                    response.data?.data ??
                    response.data ??
                    [];

                if (active) {
                    setMessages(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error(error);

                if (active) {
                    setMessages([]);
                }
            } finally {
                if (active) {
                    setMessagesLoading(false);
                }
            }
        };

        loadMessages();

        return () => {
            active = false;
        };
    }, [selectedConversation]);

    // Subscribe to inbound "new-message" SSE events. Filter to the active
    // conversation so a message destined for a different contact doesn't
    // pollute the chat. De-dupe by id because the optimistic message we add
    // on send has a different id (Date.now()) from the one the server
    // echoes back.
    useSseEvent("new-message", (message) => {
        if (!message) return;
        if (!messageBelongsToConversation(message, selectedConversation)) {
            return;
        }
        setMessages((prev) => {
            const incomingId = message.id || message.messageId;
            if (incomingId && prev.some((m) => (m.id || m.messageId) === incomingId)) {
                return prev;
            }
            return [...prev, message];
        });
    });

    // Surface status changes (open / error / reconnecting) in the console.
    useEffect(() => {
        const unsubscribe = sseClient.onStatusChange((status, detail) => {
            if (status === "error") {
                console.warn("[sse] connection error", detail);
            } else {
                console.log("[sse] status", status, detail ?? "");
            }
        });
        return unsubscribe;
    }, []);

    const handleSendMessage = async (messageText) => {
        if (
            !selectedConversation?.phoneNumber ||
            !messageText?.trim()
        ) {
            return;
        }

        try {
            const response = await sendTextMessage({
                to: selectedConversation.phoneNumber,
                body: messageText
            });

            const sentMessage =
                response.data?.data ??
                {
                    id: Date.now(),
                    body: messageText,
                    direction: "OUTBOUND",
                    createdAt: new Date().toISOString()
                };

            setMessages((prev) => [...prev, sentMessage]);
        } catch (error) {
            console.error("Failed to send message", error);
            throw error;
        }
    };

    // The "+ New Message" button calls this. We POST to /messages/text using
    // the same sendTextMessage helper as the in-conversation ChatInput, then
    // select the conversation so the user lands in the thread they just
    // messaged. The backend's eventual "new-message" SSE event will also
    // append the message to the live thread.
    const handleComposeSend = async ({ to, body }) => {
        try {
            const response = await sendTextMessage({ to, body });
            const sentMessage =
                response.data?.data ?? {
                    id: Date.now(),
                    body,
                    direction: "OUTBOUND",
                    to,
                    createdAt: new Date().toISOString()
                };
            setMessages((prev) => [...prev, sentMessage]);
            // If the user wasn't in a conversation, drop them into the one
            // they just messaged. selectedConversation is whatever the panel
            // has; we only synthesise a minimal object if the backend's
            // response doesn't include the contact shape.
            setSelectedConversation((current) => {
                if (current && current.phoneNumber === to) return current;
                return (
                    current ?? {
                        phoneNumber: to,
                        name: to,
                        displayName: to
                    }
                );
            });
            setComposeOpen(false);
        } catch (err) {
            // Re-throw so the modal can display the error without losing
            // what the user typed.
            throw err;
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                background: "background.default",
                overflow: "hidden"
            }}
        >
            <SideNav />

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0
                }}
            >
                <TopBar onNewMessage={() => setComposeOpen(true)} />

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        minHeight: 0,
                        overflow: "hidden"
                    }}
                >
                    <ConversationPanel
                        selectedConversation={selectedConversation}
                        setSelectedConversation={
                            setSelectedConversation
                        }
                    />

                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            minWidth: 0,
                            bgcolor: "#020B1F"
                        }}
                    >
                        <ChatHeader
                            conversation={selectedConversation}
                        />

                        <ChatBody
                            conversation={selectedConversation}
                            messages={messages}
                            loading={messagesLoading}
                        />

                        <ChatInput
                            disabled={!selectedConversation}
                            onSend={handleSendMessage}
                        />
                    </Box>
                </Box>
            </Box>

            <NewMessageModal
                open={composeOpen}
                onClose={() => setComposeOpen(false)}
                onSend={handleComposeSend}
            />
        </Box>
    );
}