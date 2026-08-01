import { Input, Select, Segmented, Space, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SORT_OPTIONS = [
    { value: "createdAt,desc", label: "Newest first" },
    { value: "createdAt,asc", label: "Oldest first" },
    { value: "name,asc", label: "Name A to Z" },
    { value: "name,desc", label: "Name Z to A" },
    { value: "phoneNumber,asc", label: "Phone ascending" },
    { value: "phoneNumber,desc", label: "Phone descending" },
    { value: "lastContactedAt,desc", label: "Recently contacted" },
    { value: "lastContactedAt,asc", label: "Least recently contacted" }
];

const DATE_RANGE_OPTIONS = [
    { value: "all", label: "All time", days: null },
    { value: "7d", label: "Last 7 days", days: 7 },
    { value: "30d", label: "Last 30 days", days: 30 },
    { value: "90d", label: "Last 90 days", days: 90 }
];

export default function ContactListFilters({
    search,
    onSearchChange,
    sort,
    onSortChange,
    dateRange,
    onDateRangeChange,
    totalCount,
    filteredCount
}) {
    return (
        <div className="contacts-filters">
            <Input
                size="large"
                placeholder="Search name, phone, email..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                prefix={<SearchOutlined />}
                className="contacts-search"
            />

            <Segmented
                value={dateRange}
                onChange={onDateRangeChange}
                options={DATE_RANGE_OPTIONS.map(({ value, label }) => ({ value, label }))}
                className="contacts-range"
            />

            <Select
                size="large"
                value={sort}
                onChange={onSortChange}
                options={SORT_OPTIONS.map((option) => ({
                    value: option.value,
                    label: `Sort: ${option.label}`
                }))}
                className="contacts-sort"
            />

            <Space className="contacts-count">
                <Typography.Text type="secondary">
                    {filteredCount} of {totalCount}
                </Typography.Text>
            </Space>
        </div>
    );
}

export { DATE_RANGE_OPTIONS, SORT_OPTIONS };