import { Alert, Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircleIcon from "@mui/icons-material/Circle";

const statusColor = {
    SENT: "info",
    DELIVERED: "success",
    READ: "success",
    FAILED: "error"
};

const columns = [
    {
        field: "whatsappMessageId",
        headerName: "WhatsApp Message ID",
        flex: 1,
        minWidth: 170
    },
    {
        field: "phoneNumber",
        headerName: "Contact Number",
        flex: 1,
        minWidth: 150
    },
    {
        field: "toPhoneNumber",
        headerName: "Recipient Number",
        flex: 1,
        minWidth: 150
    },
    {
        field: "templateName",
        headerName: "Template Name",
        flex: 1,
        minWidth: 170
    },
    {
        field: "messageType",
        headerName: "Message Type",
        flex: 0.9,
        minWidth: 120
    },
    {
        field: "currentStatus",
        headerName: "Status",
        flex: 0.9,
        minWidth: 120,
        renderCell: ({ value }) => (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <CircleIcon sx={{ width: 12, height: 12, color: (theme) => theme.palette[statusColor[value] || "primary"].main }} />
                <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                    {value || "-"}
                </Typography>
            </Box>
        )
    },
    {
        field: "sentAt",
        headerName: "Sent Time",
        flex: 1,
        minWidth: 180
    },
    {
        field: "deliveredAt",
        headerName: "Delivered Time",
        flex: 1,
        minWidth: 180
    },
    {
        field: "readAt",
        headerName: "Read Time",
        flex: 1,
        minWidth: 180
    },
    {
        field: "failureReason",
        headerName: "Failure Reason",
        flex: 1,
        minWidth: 180
    },
    {
        field: "createdAt",
        headerName: "Created At",
        flex: 1,
        minWidth: 180
    }
];

function CustomToolbar({ onRefresh }) {
    return (
        <GridToolbarContainer sx={{ justifyContent: "space-between", px: 2, pt: 1, pb: 1 }}>
            <GridToolbarExport csvOptions={{ fileName: "message-reports", utf8WithBom: true }} />
            <Button
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                sx={{ textTransform: "none", ml: 2 }}
                size="small"
            >
                Refresh
            </Button>
        </GridToolbarContainer>
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
    onPageSizeChange,
    onSortModelChange,
    onRowClick,
    onRefresh
}) {
    const theme = useTheme();

    return (
        <Box sx={{ width: "100%", minHeight: 520, borderRadius: 3, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
            <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <Box>
                    <Typography variant="h6">Message Reports</Typography>
                    <Typography color="text.secondary" variant="body2">
                        Review message history with server-side pagination and sorting.
                    </Typography>
                </Box>
            </Box>

            {error ? (
                <Box sx={{ px: 3, pb: 2 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            ) : null}

            <div style={{ width: "100%", height: 520 }}>
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
                    onPaginationModelChange={(model) => {
                        if (model.page !== page || model.pageSize !== pageSize) {
                            onPageChange(model.page, model.pageSize);
                        }
                    }}
                    onSortModelChange={onSortModelChange}
                    onRowClick={onRowClick}
                    slots={{ toolbar: CustomToolbar }}
                    slotProps={{
                        toolbar: {
                            onRefresh
                        }
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
                        ".MuiDataGrid-footerContainer": {
                            borderTop: "1px solid rgba(255,255,255,0.08)"
                        }
                    }}
                />
            </div>
        </Box>
    );
}
