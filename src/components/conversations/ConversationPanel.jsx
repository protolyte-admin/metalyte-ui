import { Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import ConversationList from "../sidebar/ConversationList";

export default function ConversationPanel({
    selectedConversation,
    setSelectedConversation,
    onNewMessage
}) {
    return (
        <aside className="conversation-panel">
            <header
                className="conversation-panel-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Typography.Title level={2} style={{ margin: 0 }}>
                    Messages
                </Typography.Title>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onNewMessage}
                >
                    New Message
                </Button>
            </header>

            <ConversationList
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
            />
        </aside>
    );
}