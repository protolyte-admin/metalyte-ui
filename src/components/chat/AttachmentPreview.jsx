import { Button, Space, Typography } from "antd";
import { DownloadOutlined, FileImageOutlined, FileOutlined, FilePdfOutlined } from "@ant-design/icons";

function getAttachmentIcon(type = "", name = "") {
    const value = `${type} ${name}`.toLowerCase();
    if (value.includes("pdf")) return <FilePdfOutlined />;
    if (value.includes("image") || /\.(png|jpe?g|gif|webp)$/i.test(name)) return <FileImageOutlined />;
    return <FileOutlined />;
}

export default function AttachmentPreview({ attachment }) {
    const name = attachment.name || attachment.fileName || attachment.url || "Attachment";
    const size = attachment.size || attachment.fileSize;
    const type = attachment.type || attachment.mimeType || "";
    const url = attachment.url || attachment.downloadUrl;
    const isImage = type.toLowerCase().includes("image") || /\.(png|jpe?g|gif|webp)$/i.test(name);

    if (isImage && url) {
        return <img src={url} alt={name} className="message-attachment-image" />;
    }

    return (
        <div className="message-attachment-file">
            <div className={type.toLowerCase().includes("pdf") ? "attachment-icon pdf" : "attachment-icon"}>
                {getAttachmentIcon(type, name)}
            </div>
            <div className="attachment-copy">
                <Typography.Text strong ellipsis>{name}</Typography.Text>
                {size ? <Typography.Text type="secondary" className="attachment-size">{size}</Typography.Text> : null}
            </div>
            {url ? (
                <Button href={url} target="_blank" rel="noreferrer" type="text" icon={<DownloadOutlined />} />
            ) : (
                <Space><DownloadOutlined /></Space>
            )}
        </div>
    );
}