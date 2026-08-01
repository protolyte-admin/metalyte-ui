import { Typography } from "antd";

export default function TypingIndicator({ name = "Contact" }) {
    return (
        <div className="typing-indicator">
            {/* <span className="typing-dots">
                {[0, 1, 2].map((dot) => <span key={dot} />)}
            </span> */}
            {/* <Typography.Text type="secondary">{name} is typing...</Typography.Text> */}
        </div>
    );
}