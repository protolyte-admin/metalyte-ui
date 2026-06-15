import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getReportSummary, getReportMessages } from "../services/reportService";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_FILTERS = {
    fromDate: "",
    toDate: "",
    status: "",
    messageType: "",
    phoneNumber: "",
    templateName: "",
    campaign: ""
};
const DEFAULT_SORT_MODEL = [{ field: "sentAt", sort: "desc" }];

function useDebouncedValue(value, delay = 350) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

function buildQuery({ filters, page, size, sortModel }) {
    // The API expects raw digits in phoneNumber; we let the user type formatted
    // text in the filter and strip it here so what we send is always canonical.
    const phoneNumber = (filters.phoneNumber || "").replace(/\D/g, "");

    const query = {
        page,
        size,
        sort: sortModel?.[0]
            ? `${sortModel[0].field},${sortModel[0].sort}`
            : "sentAt,desc",
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        status: filters.status || undefined,
        messageType: filters.messageType || undefined,
        phoneNumber: phoneNumber || undefined,
        templateName: filters.templateName?.trim() || undefined,
        campaign: filters.campaign?.trim() || undefined
    };

    Object.keys(query).forEach((key) => {
        if (query[key] === undefined) {
            delete query[key];
        }
    });

    return query;
}

function normalizeMessagePage(response, page, size) {
    const payload = response.data?.data ?? response.data ?? {};
    const rows =
        Array.isArray(payload?.content) && payload.content.length > 0
            ? payload.content
            : Array.isArray(payload?.items) && payload.items.length > 0
            ? payload.items
            : Array.isArray(payload)
            ? payload
            : [];

    const totalElements =
        payload?.totalElements ?? payload?.total ?? payload?.totalCount ?? rows.length;

    const normalizedRows = rows.map((row, index) => ({
        id: row.id ?? row.whatsappMessageId ?? `${page}-${index}`,
        ...row
    }));

    return {
        rows: normalizedRows,
        totalElements: Number.isFinite(totalElements) ? totalElements : normalizedRows.length
    };
}

function hasAnySummaryValue(summary) {
    if (!summary || typeof summary !== "object") return false;
    return Object.values(summary).some((value) => {
        if (value == null) return false;
        if (typeof value === "number") return value !== 0;
        if (typeof value === "string") return value.trim() !== "";
        return Boolean(value);
    });
}

export default function useReports() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState("");
    const [summaryUpdatedAt, setSummaryUpdatedAt] = useState(null);
    const [messages, setMessages] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [tableError, setTableError] = useState("");
    const [tableUpdatedAt, setTableUpdatedAt] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [rowCount, setRowCount] = useState(0);
    const [sortModel, setSortModel] = useState(DEFAULT_SORT_MODEL);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [refreshIndex, setRefreshIndex] = useState(0);
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Text fields are debounced independently of the structured fields so we
    // don't fire a request on every keystroke but still apply a date/status
    // change immediately.
    const debouncedPhone = useDebouncedValue(activeFilters.phoneNumber, 350);
    const debouncedTemplate = useDebouncedValue(activeFilters.templateName, 350);
    const debouncedCampaign = useDebouncedValue(activeFilters.campaign, 350);

    const debouncedFilters = useMemo(
        () => ({
            ...activeFilters,
            phoneNumber: debouncedPhone,
            templateName: debouncedTemplate,
            campaign: debouncedCampaign
        }),
        [activeFilters, debouncedPhone, debouncedTemplate, debouncedCampaign]
    );

    const queryParams = useMemo(
        () =>
            buildQuery({
                filters: debouncedFilters,
                page,
                size: pageSize,
                sortModel
            }),
        [debouncedFilters, page, pageSize, sortModel]
    );

    const loadSummary = useCallback(async () => {
        setSummaryLoading(true);
        setSummaryError("");

        try {
            const response = await getReportSummary(queryParams);
            const summaryData =
                response.data?.data?.data ?? response.data?.data ?? response.data ?? null;
            if (isMountedRef.current) {
                setSummary(summaryData);
                setSummaryUpdatedAt(new Date());
            }
        } catch (error) {
            if (isMountedRef.current) {
                setSummaryError(
                    error?.response?.data?.message ||
                        error?.message ||
                        "Failed to load report summary"
                );
                setSummary(null);
            }
        } finally {
            if (isMountedRef.current) {
                setSummaryLoading(false);
            }
        }
    }, [queryParams]);

    const loadMessages = useCallback(async () => {
        setTableLoading(true);
        setTableError("");

        try {
            const response = await getReportMessages(queryParams);
            const pageData = normalizeMessagePage(response, page, pageSize);
            if (isMountedRef.current) {
                setMessages(pageData.rows);
                setRowCount(pageData.totalElements);
                setTableUpdatedAt(new Date());
            }
        } catch (error) {
            if (isMountedRef.current) {
                setTableError(
                    error?.response?.data?.message ||
                        error?.message ||
                        "Failed to load messages"
                );
                setMessages([]);
                setRowCount(0);
            }
        } finally {
            if (isMountedRef.current) {
                setTableLoading(false);
            }
        }
    }, [queryParams, page, pageSize]);

    useEffect(() => {
        loadSummary();
    }, [loadSummary, refreshIndex]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages, refreshIndex]);

    const applyFilters = useCallback(
        (nextFilters = filters) => {
            setActiveFilters(nextFilters);
            setPage(0);
        },
        [filters]
    );

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setActiveFilters(DEFAULT_FILTERS);
        setSortModel(DEFAULT_SORT_MODEL);
        setPage(0);
    }, []);

    const refresh = useCallback(() => {
        setRefreshIndex((current) => current + 1);
    }, []);

    const setPaginationModel = useCallback((nextPage, nextPageSize) => {
        setPage(nextPage);
        setPageSize(nextPageSize);
    }, []);

    const summaryHasData = useMemo(() => hasAnySummaryValue(summary), [summary]);

    return {
        filters,
        setFilters,
        activeFilters,
        setActiveFilters,
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
        applyFilters,
        resetFilters,
        refresh,
        setPaginationModel,
        retrySummary: loadSummary,
        retryMessages: loadMessages
    };
}
