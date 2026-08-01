import { Empty, Tag, Timeline, Typography } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, SendOutlined } from "@ant-design/icons";

import { formatDateTimeIST, formatRelativeShortIST, parseTimestamp } from "../../utils/time";

const statusColorMap = {
    SENT: "blue",
    DELIVERED: "green",
    READ: "green",
    FAILED: "red"
};

const statusIconMap = {
    SENT: <SendOutlined />,
    DELIVERED: <CheckCircleOutlined />,
    READ: <CheckCircleOutlined />,
    FAILED: <CloseCircleOutlined />
};

const RECENT_THRESHOLD_MS = 24 * 60 * 60 * 1000;

function formatTimestamp(value, now) {
    const parsed = parseTimestamp(value);
    if (!parsed) return "";
    if (now && Math.abs(now.getTime() - parsed.getTime()) < RECENT_THRESHOLD_MS) {
        return formatRelativeShortIST(parsed, now);
    }
    return formatDateTimeIST(parsed);
}

export default function StatusTimeline({ history, now = new Date() }) {
    const items = Array.isArray(history) ? history : [];

    if (!items.length) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No status history is available for this message." />;
    }

    return (
        <Timeline
            className="reports-status-timeline"
            items={items.map((event, index) => ({
                key: `${event.status}-${event.timestamp}-${index}`,
                color: statusColorMap[event.status] || "blue",
                dot: statusIconMap[event.status] || <ClockCircleOutlined />,
                children: (
                    <div>
                        <Tag color={statusColorMap[event.status] || "blue"}>{event.status || "UNKNOWN"}</Tag>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {formatTimestamp(event.timestamp, now)}
                        </Typography.Text>
                        {event.description ? (
                            <Typography.Paragraph type="secondary" style={{ marginTop: 6, marginBottom: 0 }}>
                                {event.description}
                            </Typography.Paragraph>
                        ) : null}
                    </div>
                )
            }))}
        />
    );
}