import { Alert, Box, Button, Chip, IconButton, Stack, Tooltip, Typography, useTheme, Pagination, Select, MenuItem } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircleIcon from "@mui/icons-material/Circle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InboxIcon from "@mui/icons-material/Inbox";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { formatDateTimeIST } from "../../utils/time";
import { formatPhoneNumber } from "../../utils/format";

const statusColor = {
    SENT: "info",
    DELIVERED: "success",
    READ: "success",
    FAILED: "error"
};

function CopyableCell({ value, sx }) {
    const [copied, setCopied] = useState(false);
    const display = value || "—";

    const handleCopy = async (event) => {
        event.stopPropagation();
        if (!value) return;
        try {
            await navigator.clipboard.writeText(String(value));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard rejected (e.g. insecure context). Fail silently — the
            // user can still see and select the text.
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                width: "100%",
                ...sx
            }}
        >
            <Tooltip title={display} placement="top" arrow>
                <Typography
                    variant="body2"
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                        flex: 1
                    }}
                >
                    {display}
                </Typography>
            </Tooltip>
            {value ? (
                <Tooltip title={copied ? "Copied" : "Copy"} placement="top" arrow>
                    <IconButton
                        size="small"
                        onClick={handleCopy}
                        sx={{
                            p: 0.25,
                            color: copied ? "success.main" : "text.secondary",
                            opacity: 0.4,
                            transition: "opacity 120ms ease, color 120ms ease",
                            ".MuiDataGrid-row:hover &": { opacity: 1 }
                        }}
                    >
                        {copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
                    </IconButton>
                </Tooltip>
            ) : null}
        </Box>
    );
}

function PhoneCell({ value }) {
    return <Typography variant="body2">{formatPhoneNumber(value) || "—"}</Typography>;
}

function TimestampCell({ value }) {
    const formatted = formatDateTimeIST(value);
    return (
        <Tooltip title={value || ""} placement="top" arrow disableHoverListener={!value}>
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {formatted || "—"}
            </Typography>
        </Tooltip>
    );
}

function StatusCell({ value }) {
    const color = statusColor[value] || "primary";
    return (
        <Chip
            size="small"
            label={(value || "—").toLowerCase()}
            color={color}
            variant="outlined"
            icon={<CircleIcon sx={{ fontSize: 10, color: (theme) => `${theme.palette[color].main} !important` }} />}
            sx={{ textTransform: "capitalize", fontWeight: 600 }}
        />
    );
}

const columns = [
    {
        field: "whatsappMessageId",
        headerName: "WhatsApp Message ID",
        flex: 1.2,
        minWidth: 200,
        renderCell: ({ value }) => <CopyableCell value={value} />
    },
    {
        field: "phoneNumber",
        headerName: "Contact",
        flex: 0.8,
        minWidth: 140,
        renderCell: ({ value }) => <PhoneCell value={value} />
    },
    {
        field: "toPhoneNumber",
        headerName: "Recipient",
        flex: 0.8,
        minWidth: 140,
        renderCell: ({ value }) => <PhoneCell value={value} />
    },
    {
        field: "templateName",
        headerName: "Template",
        flex: 1,
        minWidth: 160,
        renderCell: ({ value }) => (
            <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {value || "—"}
            </Typography>
        )
    },
    {
        field: "messageType",
        headerName: "Type",
        flex: 0.7,
        minWidth: 110,
        renderCell: ({ value }) => (
            <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
                {value || "—"}
            </Typography>
        )
    },
    {
        field: "currentStatus",
        headerName: "Status",
        flex: 0.9,
        minWidth: 130,
        renderCell: ({ value }) => <StatusCell value={value} />
    },
    {
        field: "sentAt",
        headerName: "Sent",
        flex: 1,
        minWidth: 170,
        renderCell: ({ value }) => <TimestampCell value={value} />
    },
    {
        field: "deliveredAt",
        headerName: "Delivered",
        flex: 1,
        minWidth: 170,
        renderCell: ({ value }) => <TimestampCell value={value} />
    },
    {
        field: "readAt",
        headerName: "Read",
        flex: 1,
        minWidth: 170,
        renderCell: ({ value }) => <TimestampCell value={value} />
    },
    {
        field: "failureReason",
        headerName: "Failure Reason",
        flex: 1.1,
        minWidth: 180,
        renderCell: ({ value }) => <CopyableCell value={value} />
    },
    {
        field: "createdAt",
        headerName: "Created",
        flex: 1,
        minWidth: 170,
        renderCell: ({ value }) => <TimestampCell value={value} />
    }
];

function CustomToolbar({ onRefresh }) {
    return (
        <GridToolbarContainer sx={{ justifyContent: "flex-end", px: 2, pt: 1, pb: 0 }}>
            <GridToolbarExport csvOptions={{ fileName: "message-reports", utf8WithBom: true }} />
            <Button
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                sx={{ textTransform: "none", ml: 1 }}
                size="small"
            >
                Refresh
            </Button>
        </GridToolbarContainer>
    );
}

function NoRowsOverlay({ onReset, hasFilters }) {
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                py: 6,
                color: "text.secondary"
            }}
        >
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    color: "text.secondary"
                }}
            >
                <InboxIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                No messages match your filters
            </Typography>
            <Typography variant="body2">
                Try widening the date range or removing a filter to see more results.
            </Typography>
            {hasFilters ? (
                <Button variant="outlined" size="small" onClick={onReset} sx={{ mt: 1 }}>
                    Clear filters
                </Button>
            ) : null}
        </Box>
    );
}

export default function ReportsTable({
    messages,
    loading,
    error,
    page,
    pageSize,
    rowCount,
    sortModel,
    onPageChange,
    onSortModelChange,
    onRowClick,
    onRefresh,
    onReset,
    hasFilters,
    lastUpdated
}) {
    const theme = useTheme();
    const safeRowCount = Number.isFinite(rowCount) ? rowCount : 0;
    const start = safeRowCount === 0 ? 0 : page * pageSize + 1;
    const end = Math.min(safeRowCount, (page + 1) * pageSize);
    const showingLabel =
        safeRowCount === 0 ? "No messages" : `Showing ${start}–${end} of ${safeRowCount.toLocaleString("en-IN")}`;

    return (
        <Box sx={{ width: "100%", minHeight: 560, borderRadius: 3, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
            <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <Box>
                    <Typography variant="h6">Message Reports</Typography>
                    <Typography color="text.secondary" variant="body2">
                        Review message history with server-side pagination and sorting.
                    </Typography>
                </Box>
                <Stack
                    spacing={2}
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        {showingLabel}
                    </Typography>
                    {lastUpdated ? (
                        <Typography variant="caption" color="text.secondary">
                            Last updated {formatDateTimeIST(lastUpdated)}
                        </Typography>
                    ) : null}
                    <Tooltip title="Refresh" arrow>
                        <span>
                            <IconButton size="small" onClick={onRefresh} disabled={loading}>
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </Box>

            {error ? (
                <Box sx={{ px: 3, pb: 2 }}>
                    <Alert severity="error" action={onRefresh ? <Button color="inherit" size="small" onClick={onRefresh}>Retry</Button> : null}>
                        {error}
                    </Alert>
                </Box>
            ) : null}

            <div style={{ width: "100%", height: 450 }}>
                <DataGrid
                    rows={messages}
                    columns={columns}
                    rowCount={rowCount}
                    loading={loading}
                    paginationMode="server"
                    sortingMode="server"
                    disableColumnFilter
                    disableSelectionOnClick
                    pageSizeOptions={[10, 20, 50]}
                    paginationModel={{ page, pageSize }}
                    sortModel={sortModel}
                    autoHeight={false}
                    rowHeight={60}
                    getRowId={(row) => row.id ?? row.whatsappMessageId}
                    onPaginationModelChange={(model) => {
                        if (model.page !== page || model.pageSize !== pageSize) {
                            onPageChange(model.page, model.pageSize);
                        }
                    }}
                    onSortModelChange={onSortModelChange}
                    onRowClick={onRowClick}
                    slots={{
                        toolbar: CustomToolbar,
                        noRowsOverlay: () => <NoRowsOverlay onReset={onReset} hasFilters={hasFilters} />
                    }}
                    slotProps={{
                        toolbar: { onRefresh },
                        loadingOverlay: { variant: "linear-progress" }
                    }}
                    sx={{
                        border: "none",
                        ".MuiDataGrid-main": {
                            background: theme.palette.background.paper
                        },
                        ".MuiDataGrid-columnHeaders": {
                            background: theme.palette.background.default,
                            position: "sticky",
                            top: 0,
                            zIndex: 2
                        },
                        ".MuiDataGrid-columnHeaderTitle": {
                            fontWeight: 700
                        },
                        ".MuiDataGrid-cell": {
                            display: "flex",
                            alignItems: "center"
                        },
                        ".MuiDataGrid-footerContainer": {
                            borderTop: "1px solid rgba(255,255,255,0.08)"
                        },
                        ".MuiDataGrid-row:hover": {
                            backgroundColor: "rgba(185,174,255,0.06)",
                            cursor: "pointer"
                        }
                    }}
                />
            </div>

            {/* Custom Pagination UI */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    py: 2,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    background: theme.palette.background.default
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                        {safeRowCount === 0
                            ? "No messages"
                            : `Showing ${start}–${end} of ${safeRowCount.toLocaleString("en-IN")}`}
                    </Typography>
                    <Select
                        value={pageSize}
                        onChange={(event) => onPageChange(0, event.target.value)}
                        size="small"
                        disabled={loading}
                        sx={{ minWidth: 80 }}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </Stack>
                <Pagination
                    count={Math.ceil(safeRowCount / pageSize)}
                    page={page + 1}
                    onChange={(event, newPage) => onPageChange(newPage - 1, pageSize)}
                    disabled={loading}
                    color="primary"
                    size="small"
                    showFirstButton
                    showLastButton
                />
            </Box>
        </Box>
    );
}
