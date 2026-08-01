import { Button, Card, Col, DatePicker, Input, Row, Select, Space, Tag, Typography } from "antd";
import { CalendarOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useMemo } from "react";
import { formatPhoneNumber } from "../../utils/format";

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "SENT", label: "Sent" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "READ", label: "Read" },
    { value: "FAILED", label: "Failed" }
];

const MESSAGE_TYPE_OPTIONS = [
    { value: "", label: "All Types" },
    { value: "TEXT", label: "Text" },
    { value: "MEDIA", label: "Media" },
    { value: "TEMPLATE", label: "Template" },
    { value: "HSM", label: "HSM" }
];

function istDateString(date) {
    return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata"
    }).format(date);
}

function shiftDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

const QUICK_RANGES = [
    { key: "today", label: "Today", resolve: (now) => { const today = istDateString(now); return { fromDate: today, toDate: today }; } },
    { key: "yesterday", label: "Yesterday", resolve: (now) => { const y = istDateString(shiftDays(now, -1)); return { fromDate: y, toDate: y }; } },
    { key: "last7", label: "Last 7 days", resolve: (now) => ({ fromDate: istDateString(shiftDays(now, -6)), toDate: istDateString(now) }) },
    { key: "last30", label: "Last 30 days", resolve: (now) => ({ fromDate: istDateString(shiftDays(now, -29)), toDate: istDateString(now) }) },
    {
        key: "thisMonth",
        label: "This month",
        resolve: (now) => {
            const fmt = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: "Asia/Kolkata" });
            const parts = fmt.formatToParts(now);
            const y = parts.find((p) => p.type === "year")?.value;
            const m = parts.find((p) => p.type === "month")?.value;
            return { fromDate: `${y}-${m}-01`, toDate: istDateString(new Date(Date.UTC(Number(y), Number(m), 0))) };
        }
    }
];

const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS.map((opt) => [opt.value, opt.label]));
const MESSAGE_TYPE_LABELS = Object.fromEntries(MESSAGE_TYPE_OPTIONS.map((opt) => [opt.value, opt.label]));

function buildActiveChips(filters) {
    const chips = [];
    if (filters.fromDate || filters.toDate) chips.push({ key: "dateRange", label: `Date: ${filters.fromDate || "..."} to ${filters.toDate || "..."}`, field: null });
    if (filters.status) chips.push({ key: "status", label: `Status: ${STATUS_LABELS[filters.status] || filters.status}`, field: "status" });
    if (filters.messageType) chips.push({ key: "messageType", label: `Type: ${MESSAGE_TYPE_LABELS[filters.messageType] || filters.messageType}`, field: "messageType" });
    if (filters.phoneNumber) chips.push({ key: "phoneNumber", label: `Phone: ${filters.phoneNumber}`, field: "phoneNumber" });
    if (filters.templateName) chips.push({ key: "templateName", label: `Template: ${filters.templateName}`, field: "templateName" });
    if (filters.campaign) chips.push({ key: "campaign", label: `Campaign: ${filters.campaign}`, field: "campaign" });
    return chips;
}

function dateValue(value) {
    return value ? dayjs(value, "YYYY-MM-DD") : null;
}

export default function ReportsFilters({ filters, onChange, onApply, onReset, loading }) {
    const canReset = useMemo(
        () => Boolean(filters.fromDate || filters.toDate || filters.status || filters.messageType || filters.phoneNumber || filters.templateName || filters.campaign),
        [filters]
    );
    const activeChips = useMemo(() => buildActiveChips(filters), [filters]);

    const handleQuickRange = (range) => {
        const next = { ...filters, ...range.resolve(new Date()) };
        onChange(next);
        onApply(next);
    };

    const handleRemoveChip = (chip) => {
        if (chip.key === "dateRange") onChange({ ...filters, fromDate: "", toDate: "" });
        else onChange({ ...filters, [chip.field]: "" });
    };

    return (
        <Card className="reports-filter-card" bordered>
            <div className="reports-filter-header">
                <div>
                    <Typography.Title level={3}>Filters</Typography.Title>
                    <Typography.Text type="secondary">Narrow down your report by date, status, or campaign.</Typography.Text>
                </div>
                <Space wrap>
                    <Button onClick={onReset} disabled={!canReset || loading}>Reset Filters</Button>
                    <Button type="primary" onClick={() => onApply(filters)} loading={loading}>Apply Filters</Button>
                </Space>
            </div>

            <Space wrap className="reports-quick-ranges">
                <Typography.Text type="secondary"><CalendarOutlined /> Quick range:</Typography.Text>
                {QUICK_RANGES.map((range) => {
                    const next = range.resolve(new Date());
                    const active = filters.fromDate === next.fromDate && filters.toDate === next.toDate;
                    return (
                        <Tag.CheckableTag key={range.key} checked={active} onChange={() => handleQuickRange(range)}>
                            {range.label}
                        </Tag.CheckableTag>
                    );
                })}
            </Space>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <DatePicker
                        placeholder="From Date"
                        value={dateValue(filters.fromDate)}
                        onChange={(_, value) => onChange({ ...filters, fromDate: value || "" })}
                        style={{ width: "100%" }}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <DatePicker
                        placeholder="To Date"
                        value={dateValue(filters.toDate)}
                        onChange={(_, value) => onChange({ ...filters, toDate: value || "" })}
                        style={{ width: "100%" }}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Select value={filters.status} onChange={(value) => onChange({ ...filters, status: value })} options={STATUS_OPTIONS} style={{ width: "100%" }} />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Select value={filters.messageType} onChange={(value) => onChange({ ...filters, messageType: value })} options={MESSAGE_TYPE_OPTIONS} style={{ width: "100%" }} />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Input
                        placeholder="Phone Number"
                        value={filters.phoneNumber}
                        onChange={(event) => onChange({ ...filters, phoneNumber: event.target.value })}
                        onBlur={(event) => {
                            const formatted = formatPhoneNumber(event.target.value);
                            if (formatted && formatted !== event.target.value) onChange({ ...filters, phoneNumber: formatted });
                        }}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Input placeholder="Template Name" value={filters.templateName} onChange={(event) => onChange({ ...filters, templateName: event.target.value })} />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Input placeholder="Campaign" value={filters.campaign} onChange={(event) => onChange({ ...filters, campaign: event.target.value })} />
                </Col>
            </Row>

            {activeChips.length > 0 ? (
                <div className="reports-active-filters">
                    <Typography.Text type="secondary" strong>Active:</Typography.Text>
                    {activeChips.map((chip) => (
                        <Tag key={chip.key} color="blue" closable closeIcon={<CloseOutlined />} onClose={(event) => { event.preventDefault(); handleRemoveChip(chip); }}>
                            {chip.label}
                        </Tag>
                    ))}
                    <Button type="link" onClick={onReset} disabled={!canReset || loading}>Clear all</Button>
                </div>
            ) : null}
        </Card>
    );
}