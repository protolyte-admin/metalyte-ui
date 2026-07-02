import { Alert, Box, Button, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SideNav from "../components/layout/SideNav";
import ReportsSummaryCards from "../components/reports/ReportsSummaryCards";
import ReportsTable from "../components/reports/ReportsTable";
import useReports from "../hooks/useReports";

export default function ReportsPage() {
    const {
        // Summary
        summary,
        summaryHasData,
        summaryLoading,
        summaryError,
        summaryUpdatedAt,
        retrySummary,

        // Messages
        messages,
        messagesLoading,
        messagesError,
        messagesTotal,
        paginationModel,
        messageFilters,
        applyMessageFilters,
        setMessagesPaginationModel,
        reloadMessages
    } = useReports();

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                background: "background.default",
                overflow: "hidden"
            }}
        >
            <SideNav />

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 0,
                        overflowY: "auto",
                        px: { xs: 2, md: 3 },
                        py: { xs: 2, md: 3 },
                        gap: 3
                    }}
                >
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                            Reports
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            Live analytics on your WhatsApp business message performance.
                        </Typography>
                    </Box>

                    {summaryError ? (
                        <Alert
                            severity="error"
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    startIcon={<RefreshIcon />}
                                    onClick={retrySummary}
                                >
                                    Retry
                                </Button>
                            }
                        >
                            We couldn't load the latest report data. {summaryError}
                        </Alert>
                    ) : null}

                    <ReportsSummaryCards
                        summary={summary}
                        summaryHasData={summaryHasData}
                        loading={summaryLoading}
                        error={summaryError}
                        updatedAt={summaryUpdatedAt}
                    />

                    <ReportsTable
                        messages={messages}
                        loading={messagesLoading}
                        error={messagesError}
                        paginationModel={paginationModel}
                        total={messagesTotal}
                        filters={messageFilters}
                        onFiltersChange={applyMessageFilters}
                        onPaginationModelChange={setMessagesPaginationModel}
                        onSearch={reloadMessages}
                    />
                </Box>
            </Box>
        </Box>
    );
}