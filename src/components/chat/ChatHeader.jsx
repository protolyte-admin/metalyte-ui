import { Button, Space, Typography } from "antd";
import { MoreOutlined, PhoneOutlined, VideoCameraOutlined } from "@ant-design/icons";

import MarqAvatar from "../common/MarqAvatar";

function getConversationName(conversation) {
    return conversation?.name || conversation?.displayName || conversation?.contactName || conversation?.phoneNumber || "Select a conversation";
}

export default function ChatHeader({ conversation }) {
    const name = getConversationName(conversation);

    return (
        <header className="chat-header">
            <Space size={14} className="chat-header-person">
                {conversation ? (
                    <MarqAvatar online={conversation.online !== false} src={conversation.avatarUrl}>
                        {!conversation.avatarUrl && name.slice(0, 1).toUpperCase()}
                    </MarqAvatar>
                ) : null}
                <div className="chat-header-copy">
                    <Typography.Text strong className="chat-header-title">{name}</Typography.Text>
                    {conversation ? <Typography.Text className="chat-header-status">Online</Typography.Text> : null}
                </div>
            </Space>

            {conversation ? (
                <Space size={8}>
                    <Button aria-label="Call" type="text" shape="circle" icon={<PhoneOutlined />} />
                    <Button aria-label="Video call" type="text" shape="circle" icon={<VideoCameraOutlined />} />
                    <Button aria-label="More options" type="text" shape="circle" icon={<MoreOutlined />} />
                </Space>
            ) : null}
        </header>
    );
}