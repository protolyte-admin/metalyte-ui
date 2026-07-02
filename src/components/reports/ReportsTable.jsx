import { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { formatDateTimeIST } from "../../utils/time";
import {
    Box,
    Paper,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Stack,
    Typography
} from "@mui/material";

const STATUS_OPTIONS = ["ACCEPTED", "DELIVERED", "READ", "SENT", "FAILED"];
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const columns = [
    { field: "id", headerName: "ID", width: 240 },
    { field: "whatsappMessageId", headerName: "WhatsApp Message ID", width: 360 },
    { field: "contactId", headerName: "Contact ID", width: 180 },
    { field: "phoneNumber", headerName: "From", width: 140 },
    { field: "toPhoneNumber", headerName: "To", width: 140 },
    { field: "templateName", headerName: "Template", width: 160 },
    { field: "campaignId", headerName: "Campaign", width: 160 },
    { field: "messageBody", headerName: "Message", minWidth: 280, flex: 1 },
    { field: "messageType", headerName: "Type", width: 120 },
    { field: "currentStatus", headerName: "Status", width: 140 },
    {
        field: "sentAt",
        headerName: "Sent At",
        width: 180,
        valueFormatter: (value) => (value ? formatDateTimeIST(value) : "-")
    },
    {
        field: "deliveredAt",
        headerName: "Delivered At",
        width: 180,
        valueFormatter: (value) => (value ? formatDateTimeIST(value) : "-")
    },
    {
        field: "readAt",
        headerName: "Read At",
        width: 180,
        valueFormatter: (value) => (value ? formatDateTimeIST(value) : "-")
    },
    {
        field: "failedAt",
        headerName: "Failed At",
        width: 180,
        valueFormatter: (value) => (value ? formatDateTimeIST(value) : "-")
    },
    { field: "failureReason", headerName: "Failure Reason", width: 240 },
    {
        field: "createdAt",
        headerName: "Created At",
        width: 180,
        valueFormatter: (value) => (value ? formatDateTimeIST(value) : "-")
    },
    {
        field: "updatedAt",
        headerName: "Updated At",
        width: 180,
        valueFormatter: (value) => (value ? formatDateTimeIST(value) : "-")
    }
];

function buildRow(message, page, index) {
    const id =
        message.id ??
        message.reportId ??
        message.whatsappMessageId ??
        message.messageId ??
        `${page}-${index}`;

    return {
        id,
        whatsappMessageId: message.whatsappMessageId,
        contactId: message.contactId,
        phoneNumber: message.phoneNumber,
        toPhoneNumber: message.toPhoneNumber,
        templateName: message.templateName,
        campaignId: message.campaignId,
        messageBody: message.messageBody,
        messageType: message.messageType,
        currentStatus: message.currentStatus,
        sentAt: message.sentAt,
        deliveredAt: message.deliveredAt,
        readAt: message.readAt,
        failedAt: message.failedAt,
        failureReason: message.failureReason,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
    };
}

export default function ReportsTable({
    messages,
    loading,
    error,
    paginationModel,
    total,
    filters,
    onFiltersChange,
    onPaginationModelChange,
    onSearch
}) {
    const rows = useMemo(() => {
        if (!Array.isArray(messages)) return [];
        return messages.map((message, index) =>
            buildRow(message, paginationModel.page, index)
        );
    }, [messages, paginationModel.page]);

    return (
        <Box>
            <FilterBar
                filters={filters}
                onFiltersChange={onFiltersChange}
                onSearch={onSearch}
            />

            <Paper sx={{ width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                    paginationMode="server"
                    paginationModel={paginationModel}
                    rowCount={Number.isFinite(total) ? total : 0}
                    onPaginationModelChange={onPaginationModelChange}
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    disableRowSelectionOnClick
                    sx={{ border: 0, minHeight: 360 }}
                />
            </Paper>

            {error ? (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            ) : null}
        </Box>
    );
}

function FilterBar({ filters, onFiltersChange, onSearch }) {
    const update = (patch) => onFiltersChange({ ...filters, ...patch });

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Stack
                spacing={2}
                sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" }
                }}
            >
                <TextField
                    label="From"
                    type="date"
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={filters.fromDate || ""}
                    onChange={(event) => update({ fromDate: event.target.value })}
                />
                <TextField
                    label="To"
                    type="date"
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={filters.toDate || ""}
                    onChange={(event) => update({ toDate: event.target.value })}
                />
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        label="Status"
                        value={filters.status ?? ""}
                        onChange={(event) => update({ status: event.target.value })}
                    >
                        <MenuItem value="">Any</MenuItem>
                        {STATUS_OPTIONS.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Search"
                    size="small"
                    value={filters.search || ""}
                    onChange={(event) => update({ search: event.target.value })}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") onSearch();
                    }}
                    sx={{ flex: 1, minWidth: 160 }}
                />
                <Button variant="contained" onClick={onSearch}>
                    Apply
                </Button>
            </Stack>
        </Paper>
    );
}
