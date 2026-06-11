import { Box, Typography } from "@mui/material";
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
        summary,
        summaryLoading,
        summaryError,
        messages,
        tableLoading,
        tableError,
        page,
        pageSize,
        rowCount,
        sortModel,
        setSortModel,
        selectedMessage,
        setSelectedMessage,
        applyFilters,
        resetFilters,
        refresh,
        setPaginationModel
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

                    <ReportsSummaryCards
                        summary={summary}
                        loading={summaryLoading}
                        error={summaryError}
                    />

                    <ReportsFilters
                        filters={filters}
                        onChange={setFilters}
                        onApply={() => applyFilters()}
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
                    />
                </Box>
            </Box>

            <MessageDetailsDrawer
                message={selectedMessage}
                onClose={() => setSelectedMessage(null)}
            />
        </Box>
    );
}
