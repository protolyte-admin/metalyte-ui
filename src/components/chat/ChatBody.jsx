import { Empty, Spin, Typography } from "antd";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { formatDayIST, isSameDayIST, parseTimestamp } from "../../utils/time";

function getConversationName(conversation) {
    return conversation?.name || conversation?.displayName || conversation?.contactName || conversation?.phoneNumber || "Contact";
}

function getMessageTime(message) {
    return message.time || message.sentAt || message.createdAt || message.timestamp || null;
}

function sortMessagesAsc(messages) {
    return [...messages].sort((a, b) => {
        const ta = parseTimestamp(getMessageTime(a))?.getTime() ?? 0;
        const tb = parseTimestamp(getMessageTime(b))?.getTime() ?? 0;
        return ta === tb ? 0 : ta - tb;
    });
}

export default function ChatBody({ conversation, messages, loading }) {
    const scrollRef = useRef(null);
    const orderedMessages = useMemo(() => sortMessagesAsc(messages || []), [messages]);

    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [orderedMessages, conversation?.phoneNumber]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onResize = () => { el.scrollTop = el.scrollHeight; };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const handleScroll = () => {
            const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
            el.dataset.nearBottom = distanceFromBottom < 80 ? "true" : "false";
        };
        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        if (el.dataset.nearBottom !== "false") el.scrollTop = el.scrollHeight;
    }, [orderedMessages.length]);

    return (
        <main ref={scrollRef} className="chat-body">
            {!conversation ? (
                <div className="chat-state"><Empty description="Select a conversation to view messages" /></div>
            ) : null}

            {conversation && loading ? (
                <div className="chat-state"><Spin /></div>
            ) : null}

            {conversation && !loading && orderedMessages.length === 0 ? (
                <div className="chat-state"><Empty description="No messages available for this conversation" /></div>
            ) : null}

            {conversation && !loading && orderedMessages.map((message, index) => {
                const prev = orderedMessages[index - 1];
                const showSeparator = index === 0 || !isSameDayIST(getMessageTime(prev), getMessageTime(message));
                return (
                    <div key={message.id || message.messageId || index}>
                        {showSeparator ? (
                            <div className="chat-day-separator">
                                <Typography.Text>{formatDayIST(getMessageTime(message))}</Typography.Text>
                            </div>
                        ) : null}
                        <MessageBubble message={message} />
                    </div>
                );
            })}

            {conversation && !loading && orderedMessages.length > 0 ? <TypingIndicator name={getConversationName(conversation)} /> : null}
        </main>
    );
}