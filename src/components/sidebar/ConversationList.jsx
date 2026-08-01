import { Empty, Input, Spin, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";

import ConversationItem from "./ConversationItem";
import { getConversations } from "../../api/conversationApi";

function ConversationList({ selectedConversation, setSelectedConversation }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        let active = true;

        getConversations()
            .then((response) => {
                const data = response.data.data ?? response.data ?? [];
                if (active) setConversations(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error(error);
                if (active) setConversations([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const filteredConversations = useMemo(() => {
        const value = query.trim().toLowerCase();
        if (!value) return conversations;

        return conversations.filter((conversation) => {
            const name = conversation.name || conversation.displayName || conversation.contactName || conversation.phoneNumber || "";
            const lastMessage = conversation.lastMessage || conversation.preview || conversation.message || "";
            return `${name} ${lastMessage}`.toLowerCase().includes(value);
        });
    }, [conversations, query]);

    return (
        <div className="conversation-list">
            <div className="conversation-search-wrap">
                <Input
                    size="large"
                    placeholder="Search messages..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    prefix={<SearchOutlined />}
                    allowClear
                />
            </div>

            {loading ? (
                <div className="conversation-loading"><Spin /></div>
            ) : null}

            {!loading && filteredConversations.length === 0 ? (
                <div className="conversation-empty">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No conversations found" />
                    <Typography.Text type="secondary">Try a different search term.</Typography.Text>
                </div>
            ) : null}

            {!loading && filteredConversations.map((conversation) => (
                <ConversationItem
                    key={conversation.id || conversation.phoneNumber}
                    conversation={conversation}
                    selected={selectedConversation?.phoneNumber === conversation.phoneNumber}
                    onClick={() => setSelectedConversation(conversation)}
                />
            ))}
        </div>
    );
}

export default ConversationList;