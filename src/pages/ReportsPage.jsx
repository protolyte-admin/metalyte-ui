import { Alert, Box, Button, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SideNav from "../components/layout/SideNav";
import TopBar from "../components/layout/TopBar";
import ReportsSummaryCards from "../components/reports/ReportsSummaryCards";
import ReportsFilters from "../components/reports/ReportsFilters";
import ReportsTable from "../components/reports/ReportsTable";
import MessageDetailsDrawer from "../components/reports/MessageDetailsDrawer";
import useReports from "../hooks/useReports";

export default function ReportsPage() {
    const {
        filters,
        setFilters,
        activeFilters,
        applyFilters,
        resetFilters,
        refresh,
        summary,
        summaryHasData,
        summaryLoading,
        summaryError,
        summaryUpdatedAt,
        messages,
        tableLoading,
        tableError,
        tableUpdatedAt,
        page,
        pageSize,
        rowCount,
        sortModel,
        setSortModel,
        selectedMessage,
        setSelectedMessage,
        setPaginationModel,
        retrySummary,
        retryMessages
    } = useReports();

    const hasFilter = Boolean(
        activeFilters.fromDate ||
            activeFilters.toDate ||
            activeFilters.status ||
            activeFilters.messageType ||
            activeFilters.phoneNumber ||
            activeFilters.templateName ||
            activeFilters.campaign
    );

    const handleNavigate = (index) => {
        if (index >= 0 && index < messages.length) {
            setSelectedMessage(messages[index]);
        }
    };

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
                <TopBar />

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 0,
                        overflowY: "auto",
                        px: {
                            xs: 2,
                            md: 3
                        },
                        py: {
                            xs: 2,
                            md: 3
                        },
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

                    {summaryError && tableError ? (
                        <Alert
                            severity="error"
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    startIcon={<RefreshIcon />}
                                    onClick={() => {
                                        retrySummary();
                                        retryMessages();
                                    }}
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

                    <ReportsFilters
                        filters={filters}
                        onChange={setFilters}
                        onApply={applyFilters}
                        onReset={resetFilters}
                        loading={tableLoading || summaryLoading}
                    />

                    <ReportsTable
                        messages={messages}
                        loading={tableLoading}
                        error={tableError}
                        page={page}
                        pageSize={pageSize}
                        rowCount={rowCount}
                        sortModel={sortModel}
                        onPageChange={(nextPage, nextPageSize) => setPaginationModel(nextPage, nextPageSize)}
                        onPageSizeChange={(nextPageSize) => setPaginationModel(0, nextPageSize)}
                        onSortModelChange={(nextSortModel) => {
                            setSortModel(nextSortModel.length ? nextSortModel : [{ field: "sentAt", sort: "desc" }]);
                            setPaginationModel(0, pageSize);
                        }}
                        onRowClick={(params) => setSelectedMessage(params.row)}
                        onRefresh={refresh}
                        onReset={resetFilters}
                        hasFilters={hasFilter}
                        lastUpdated={tableUpdatedAt}
                    />
                </Box>
            </Box>

            <MessageDetailsDrawer
                message={selectedMessage}
                messages={messages}
                onClose={() => setSelectedMessage(null)}
                onNavigate={handleNavigate}
            />
        </Box>
    );
}
