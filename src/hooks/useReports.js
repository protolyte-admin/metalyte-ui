import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getReportSummary, getReportMessages } from "../services/reportService";

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

const DEFAULT_SUMMARY_FILTERS = { fromDate: "", toDate: "" };
const DEFAULT_MESSAGE_FILTERS = { fromDate: "", toDate: "", status: "", search: "" };
const DEFAULT_PAGE_SIZE = 20;

function findSummaryPayload(payload) {
    if (!payload || typeof payload !== "object") return payload;
    const direct = payload.summary || payload.reportSummary || payload.metrics || payload.statistics || payload.stats;
    if (direct && typeof direct === "object") return direct;
    for (const key of ["data", "payload", "result", "response"]) {
        const nested = payload[key];
        if (nested && typeof nested === "object") {
            const found = findSummaryPayload(nested);
            if (found && typeof found === "object" && !Array.isArray(found)) return found;
        }
    }
    return payload;
}

function looseNumber(source, aliases, { percentage = false } = {}) {
    if (!source || typeof source !== "object") return null;
    for (const alias of aliases) {
        const raw = source[alias] ?? source[alias.toLowerCase()];
        if (raw === undefined || raw === null || raw === "") continue;
        const cleaned = typeof raw === "string" ? raw.replace("%", "").trim() : raw;
        const n = Number(cleaned);
        if (!Number.isFinite(n)) continue;
        if (percentage && n > 0 && n <= 1) return n * 100;
        return n;
    }
    return null;
}

function normalizeSummary(rawSummary) {
    const raw = rawSummary?.data ?? rawSummary ?? {};
    return {
        ...raw,
        totalSent: looseNumber(raw, ["totalSent", "sent", "sentCount", "totalMessages"]),
        totalDelivered: looseNumber(raw, ["totalDelivered", "delivered"]),
        totalRead: looseNumber(raw, ["totalRead", "read"]),
        totalFailed: looseNumber(raw, ["totalFailed", "failed"]),
        deliveryRate: looseNumber(raw, ["deliveryRate", "deliveredRate"], { percentage: true }),
        readRate: looseNumber(raw, ["readRate", "seenRate"], { percentage: true }),
        failureRate: looseNumber(raw, ["failureRate", "failedRate"], { percentage: true })
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

// Stable, comparable serialization of a query object. Used as the effect dep so
// re-renders with a logically-identical query don't re-fire the fetch.
function stableQueryKey(query) {
    if (!query || typeof query !== "object") return "";
    return Object.keys(query)
        .sort()
        .map((k) => `${k}=${query[k] ?? ""}`)
        .join("&");
}

function normalizeReportRow(row, page, index) {
    const id =
        row.id ??
        row.reportId ??
        row.whatsappMessageId ??
        row.messageId ??
        row.externalMessageId ??
        `${page}-${index}`;

    return {
        ...row,
        id,
        whatsappMessageId:
            row.whatsappMessageId ??
            row.waMessageId ??
            row.messageId ??
            row.externalMessageId,
        phoneNumber:
            row.phoneNumber ??
            row.contactPhoneNumber ??
            row.fromPhoneNumber ??
            row.from,
        toPhoneNumber:
            row.toPhoneNumber ??
            row.recipientPhoneNumber ??
            row.to ??
            row.recipient,
        messageBody:
            row.messageBody ??
            row.body ??
            row.text ??
            row.content,
        currentStatus:
            row.currentStatus ??
            row.status ??
            row.messageStatus
    };
}

function normalizeMessagePage(response, page) {
    const payload = response?.data ?? {};
    const pagePayload =
        payload?.data?.data ??
        payload?.data ??
        payload?.payload ??
        payload?.result ??
        payload;

    const items =
        pagePayload?.content ??
        pagePayload?.items ??
        pagePayload?.records ??
        pagePayload?.rows ??
        pagePayload?.messages ??
        pagePayload?.data ??
        (Array.isArray(pagePayload) ? pagePayload : []);

    const rows = Array.isArray(items)
        ? items.map((row, index) => normalizeReportRow(row, page, index))
        : [];

    const total =
        pagePayload?.totalElements ??
        pagePayload?.total ??
        pagePayload?.totalCount ??
        payload?.totalElements ??
        payload?.total ??
        rows.length;

    return {
        rows,
        total: Number.isFinite(Number(total)) ? Number(total) : rows.length
    };
}
// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export default function useReports() {
    // Summary state
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState("");
    const [summaryUpdatedAt, setSummaryUpdatedAt] = useState(null);
    const [summaryFilters, setSummaryFilters] = useState(DEFAULT_SUMMARY_FILTERS);
    const [refreshIndex, setRefreshIndex] = useState(0);

    // Messages / table state
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState("");
    const [messagesTotal, setMessagesTotal] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [messageFilters, setMessageFilters] = useState(DEFAULT_MESSAGE_FILTERS);

    const isMountedRef = useRef(true);
    const messagesRequestIdRef = useRef(0);
    useEffect(() => () => (isMountedRef.current = false), []);

    // -------------------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------------------

    const summaryQuery = useMemo(() => {
        const q = { fromDate: summaryFilters.fromDate || undefined, toDate: summaryFilters.toDate || undefined };
        Object.keys(q).forEach((k) => q[k] === undefined && delete q[k]);
        return q;
    }, [summaryFilters]);
    const summaryQueryKey = useMemo(() => stableQueryKey(summaryQuery), [summaryQuery]);

    const loadSummary = useCallback(async () => {
        setSummaryLoading(true);
        setSummaryError("");
        try {
            const response = await getReportSummary(summaryQuery);
            const payload = response?.data;
            const found = findSummaryPayload(payload) || payload?.data || payload;
            const normalized = normalizeSummary(found);
            if (isMountedRef.current) {
                setSummary(normalized);
                setSummaryUpdatedAt(new Date());
            }
        
        } catch (error) {
            if (isMountedRef.current) {
                setSummaryError(error?.response?.data?.message || error?.message || "Failed to load report summary");
                setSummary(null);
            }
        } finally {
            if (isMountedRef.current) 
                setSummaryLoading(false);
        }
        // summaryQuery is referenced by closure. summaryQueryKey changes iff the
        // query's serialized form changes, which is the right trigger.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [summaryQueryKey]);

    useEffect(() => {
        const t = window.setTimeout(() => loadSummary(), 0);
        return () => window.clearTimeout(t);
    }, [loadSummary, refreshIndex]);

    const applySummaryFilters = useCallback((next) => setSummaryFilters(next ?? DEFAULT_SUMMARY_FILTERS), []);
    const resetSummaryFilters = useCallback(() => setSummaryFilters(DEFAULT_SUMMARY_FILTERS), []);
    const refresh = useCallback(() => setRefreshIndex((c) => c + 1), []);
    const retrySummary = loadSummary;

    // -------------------------------------------------------------------------
    // Messages
    // -------------------------------------------------------------------------

    const messagesQuery = useMemo(() => {
        const q = { page: paginationModel.page, size: paginationModel.pageSize };
        if (messageFilters.fromDate) q.fromDate = messageFilters.fromDate;
        if (messageFilters.toDate) q.toDate = messageFilters.toDate;
        if (messageFilters.status) q.status = messageFilters.status;
        if (messageFilters.search) q.search = messageFilters.search;
        return q;
    }, [paginationModel, messageFilters]);
    const messagesQueryKey = useMemo(() => stableQueryKey(messagesQuery), [messagesQuery]);

    const loadMessages = useCallback(async () => {
        const requestId = ++messagesRequestIdRef.current;

        setMessagesLoading(true);
        setMessagesError("");

        try {
            const response = await getReportMessages(messagesQuery);
            const pageData = normalizeMessagePage(response, messagesQuery.page);

            if (isMountedRef.current && messagesRequestIdRef.current === requestId) {
                setMessages(pageData.rows);
                setMessagesTotal(pageData.total);
            }
        } catch (err) {
            if (isMountedRef.current && messagesRequestIdRef.current === requestId) {
                setMessagesError(err?.response?.data?.message || err?.message || "Failed to load messages");
                setMessages([]);
                setMessagesTotal(0);
            }
        } finally {
            
            if (isMountedRef.current && messagesRequestIdRef.current === requestId) {
                setMessagesLoading(false);
            }
        }
    }, [messagesQuery]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            loadMessages();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [loadMessages, refreshIndex]);

    const applyMessageFilters = useCallback((next) => {
        const nextFilters = next ?? DEFAULT_MESSAGE_FILTERS;

        setMessageFilters((prev) =>
            stableQueryKey(prev) === stableQueryKey(nextFilters) ? prev : nextFilters
        );

        setPaginationModel((model) =>
            model.page === 0 ? model : { ...model, page: 0 }
        );
    }, []);

    const setMessagesPaginationModel = useCallback((model) => {
        setPaginationModel((prev) => {
            const nextPage = model?.page ?? prev.page;
            const nextSize = model?.pageSize ?? prev.pageSize;

            if (nextPage === prev.page && nextSize === prev.pageSize) {
                return prev;
            }

            if (nextSize !== prev.pageSize) {
                return { page: 0, pageSize: nextSize };
            }

            return { page: nextPage, pageSize: nextSize };
        });
    }, []);

    const reloadMessages = useCallback(() => {
        loadMessages();
    }, [loadMessages]);
    // -------------------------------------------------------------------------
    // Derived
    // -------------------------------------------------------------------------

    const summaryHasData = useMemo(() => hasAnySummaryValue(summary), [summary]);

    return {
        // Summary
        summary,
        summaryHasData,
        summaryLoading,
        summaryError,
        summaryUpdatedAt,
        summaryFilters,
        applySummaryFilters,
        resetSummaryFilters,
        refresh,
        retrySummary,

        // Messages / table
        messages,
        messagesLoading,
        messagesError,
        messagesTotal,
        paginationModel,
        messageFilters,
        applyMessageFilters,
        setMessagesPaginationModel,
        reloadMessages
    };
}


