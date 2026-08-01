import { Button, Input, Space, Tooltip, Typography } from "antd";
import { BoldOutlined, CodeOutlined, FileAddOutlined, ItalicOutlined, OrderedListOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { useState } from "react";

const editorTools = [
    { label: "Bold", icon: <BoldOutlined /> },
    { label: "Italic", icon: <ItalicOutlined /> },
    { label: "List", icon: <OrderedListOutlined /> },
    { label: "Code", icon: <CodeOutlined /> }
];

export default function ChatInput({ disabled = false, onSend }) {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async () => {
        const trimmed = message.trim();
        if (!trimmed || !onSend) return;
        try {
            setSending(true);
            setMessage("");
            await onSend(trimmed);
        } catch (error) {
            setMessage(trimmed);
            console.error("ChatInput: send failed", error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <footer className="chat-input-wrap">
            <div className="chat-input-shell">
                <Space size={6} className="chat-editor-toolbar">
                    {editorTools.map((tool) => (
                        <Tooltip key={tool.label} title={tool.label}>
                            <Button type="text" size="small" icon={tool.icon} disabled={disabled} />
                        </Tooltip>
                    ))}
                </Space>

                <div className="chat-compose-row">
                    <Tooltip title="Attach file">
                        <Button type="text" shape="circle" icon={<FileAddOutlined />} disabled={disabled} />
                    </Tooltip>

                    <Input.TextArea
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        variant="borderless"
                        placeholder="Type your message..."
                        value={message}
                        disabled={disabled || sending}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="chat-compose-input"
                    />

                    <Tooltip title="Emoji">
                        <Button type="text" shape="circle" icon={<SmileOutlined />} disabled={disabled} />
                    </Tooltip>

                    <Tooltip title="Send">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SendOutlined />}
                            disabled={disabled || sending || !message.trim()}
                            loading={sending}
                            onClick={handleSubmit}
                            className="chat-send-button"
                        />
                    </Tooltip>
                </div>
            </div>

            <div className="chat-input-meta">
                <Typography.Text type="secondary"><span className="chat-save-dot" />Auto-save active</Typography.Text>
                <Typography.Text type="secondary" className="chat-send-hint">Press Ctrl + Enter to send</Typography.Text>
            </div>
        </footer>
    );
}