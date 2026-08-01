import { Alert, Button, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

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
        if (index >= 0 && index < messages.length) setSelectedMessage(messages[index]);
    };

    return (
        <>
            <div className="reports-page">
                <div>
                    <Typography.Title level={1} className="page-title">Reports</Typography.Title>
                    <Typography.Text type="secondary">Live analytics on your WhatsApp business message performance.</Typography.Text>
                </div>

                {summaryError && tableError ? (
                    <Alert
                        type="error"
                        showIcon
                        message="We couldn't load the latest report data."
                        description={summaryError}
                        action={
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => {
                                    retrySummary();
                                    retryMessages();
                                }}
                            >
                                Retry
                            </Button>
                        }
                    />
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
            </div>

            <MessageDetailsDrawer
                message={selectedMessage}
                messages={messages}
                onClose={() => setSelectedMessage(null)}
                onNavigate={handleNavigate}
            />
        </>
    );
}