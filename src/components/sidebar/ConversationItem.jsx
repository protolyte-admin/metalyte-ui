import { Badge, Space, Tag, Typography } from "antd";

import MarqAvatar from "../common/MarqAvatar";
import { formatRelativeShortIST, parseTimestamp } from "../../utils/time";

function getConversationName(conversation) {
    return conversation.name || conversation.displayName || conversation.contactName || conversation.phoneNumber || "Unknown contact";
}

function getInitials(name) {
    return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function getConversationTime(conversation) {
    return conversation.lastMessageTime || conversation.lastMessageAt || conversation.time || conversation.updatedAt || conversation.createdAt || "";
}

function ConversationItem({ conversation, selected, onClick }) {
    const name = getConversationName(conversation);
    const preview = conversation.lastMessage || conversation.preview || conversation.message || "No recent messages";
    const timeValue = getConversationTime(conversation);
    const time = timeValue ? formatRelativeShortIST(timeValue) : "";
    const unread = conversation.unreadCount || conversation.unread || 0;
    const hasValidTime = Boolean(parseTimestamp(timeValue));

    return (
        <button type="button" onClick={onClick} className={selected ? "conversation-item selected" : "conversation-item"}>
            <MarqAvatar online={conversation.online} src={conversation.avatarUrl}>
                {!conversation.avatarUrl && getInitials(name)}
            </MarqAvatar>

            <div className="conversation-item-copy">
                <Space align="start" className="conversation-item-title-row">
                    <Typography.Text strong className="conversation-item-name">{name}</Typography.Text>
                    {hasValidTime ? <Typography.Text type="secondary" className="conversation-item-time">{time}</Typography.Text> : null}
                </Space>

                <Typography.Text type="secondary" className="conversation-item-preview">
                    {preview}
                </Typography.Text>

                {conversation.tag || unread ? (
                    <Space size={8} className="conversation-item-meta">
                        {conversation.tag ? <Tag>{conversation.tag}</Tag> : null}
                        {unread ? <Badge count={unread} /> : null}
                    </Space>
                ) : null}
            </div>
        </button>
    );
}

export default ConversationItem;