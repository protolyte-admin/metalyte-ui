import { Typography } from "antd";

import AttachmentPreview from "./AttachmentPreview";
import { formatTimeIST } from "../../utils/time";

function getMessageText(message) {
    return message.text || message.body || message.content || message.message || "";
}

function getMessageTime(message) {
    return message.time || message.sentAt || message.createdAt || message.timestamp || "";
}

function getDirection(message) {
    if (message.outgoing === true || message.isOutgoing === true || message.fromMe === true || message.sentByMe === true) return "OUT";
    if (message.incoming === true || message.isIncoming === true || (message.fromMe === false && message.outgoing !== true)) return "IN";

    const directionalField = (message.direction ?? message.messageDirection ?? message.flow ?? "").toString().toUpperCase().trim();
    if (["OUT", "OUTBOUND", "OUTGOING"].includes(directionalField)) return "OUT";
    if (["IN", "INBOUND", "INCOMING"].includes(directionalField)) return "IN";
    return "UNKNOWN";
}

function isOutgoing(message) {
    const direction = getDirection(message);
    if (direction === "OUT") return true;
    if (direction === "IN") return false;
    return false;
}

export default function MessageBubble({ message }) {
    const outgoing = isOutgoing(message);
    const text = getMessageText(message);
    const attachments = message.attachments || message.files || [];
    const timeLabel = formatTimeIST(getMessageTime(message));

    return (
        <div className={outgoing ? "message-row outgoing" : "message-row incoming"}>
            <article className={outgoing ? "message-bubble outgoing" : "message-bubble incoming"}>
                {text ? <Typography.Text className="message-text">{text}</Typography.Text> : null}
                {attachments.map((attachment, index) => (
                    <AttachmentPreview key={attachment.id || attachment.url || attachment.name || index} attachment={attachment} />
                ))}
                {timeLabel ? <Typography.Text className="message-time">{timeLabel}</Typography.Text> : null}
            </article>
        </div>
    );
}