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

function asArray(value) {
    return Array.isArray(value) ? value : null;
}

function firstDefined(...values) {
    return values.find((value) => value !== undefined && value !== null);
}

function normalizeKey(key) {
    return String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function flattenObjectValues(source, prefix = "", output = {}) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
        return output;
    }

    Object.entries(source).forEach(([key, value]) => {
        const nextKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === "object" && !Array.isArray(value)) {
            flattenObjectValues(value, nextKey, output);
            return;
        }

        output[normalizeKey(key)] = value;
        output[normalizeKey(nextKey)] = value;
    });

    return output;
}

function looseValue(source, aliases) {
    if (!source || typeof source !== "object") return undefined;

    const flattened = flattenObjectValues(source);

    for (const alias of aliases) {
        const value = flattened[normalizeKey(alias)];
        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return undefined;
}

function looseNumber(source, aliases, { percentage = false } = {}) {
    const value = looseValue(source, aliases);
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const cleaned =
        typeof value === "string" ? value.replace("%", "").trim() : value;
    const number = Number(cleaned);

    if (!Number.isFinite(number)) {
        return null;
    }

    if (percentage && number > 0 && number <= 1) {
        return number * 100;
    }

    return number;
}

function statusCountsFromArray(source) {
    const arrays = [
        source?.statusCounts,
        source?.statusSummary,
        source?.byStatus,
        source?.statuses
    ].filter(Array.isArray);

    const counts = {};

    arrays.flat().forEach((item) => {
        const status = normalizeKey(
            item.status ||
                item.currentStatus ||
                item.name ||
                item.key ||
                item.label ||
                ""
        );
        const count = looseNumber(item, ["count", "total", "value"]);

        if (!status || count == null) return;

        if (status.includes("sent")) counts.sent = count;
        if (status.includes("delivered")) counts.delivered = count;
        if (status.includes("read") || status.includes("seen")) counts.read = count;
        if (status.includes("failed") || status.includes("error")) counts.failed = count;
    });

    return counts;
}

function findNestedArray(payload) {
    if (!payload || typeof payload !== "object") return [];

    // Handle wrapper structure where data is nested under payload.data
    if (payload.data && typeof payload.data === "object") {
        const nestedResult = findNestedArray(payload.data);
        if (nestedResult.length) return nestedResult;
    }

    const direct =
        asArray(payload) ||
        asArray(payload.content) ||
        asArray(payload.items) ||
        asArray(payload.records) ||
        asArray(payload.rows) ||
        asArray(payload.messages) ||
        asArray(payload.results) ||
        asArray(payload.data);

    if (direct) return direct;

    const candidateKeys = ["page", "payload", "result", "response"];
    for (const key of candidateKeys) {
        const nested = findNestedArray(payload[key]);
        if (nested.length) return nested;
    }

    return [];
}

function findTotalElements(payload, fallback) {
    if (!payload || typeof payload !== "object") return fallback;

    const total = firstDefined(
        payload.totalElements,
        payload.total,
        payload.totalCount,
        payload.totalRecords,
        payload.count
    );

    if (total !== undefined) {
        const number = Number(total);
        return Number.isFinite(number) ? number : fallback;
    }

    const candidateKeys = ["data", "page", "payload", "result", "response"];
    for (const key of candidateKeys) {
        const nested = findTotalElements(payload[key], undefined);
        if (nested !== undefined) return nested;
    }

    return fallback;
}

function findSummaryPayload(payload) {
    if (!payload || typeof payload !== "object") return payload;

    const direct =
        payload.summary ||
        payload.reportSummary ||
        payload.metrics ||
        payload.statistics ||
        payload.stats;

    if (direct && typeof direct === "object") {
        return direct;
    }

    const candidateKeys = ["data", "payload", "result", "response"];
    for (const key of candidateKeys) {
        if (payload[key] && typeof payload[key] === "object") {
            const nested = findSummaryPayload(payload[key]);
            if (nested && typeof nested === "object" && !Array.isArray(nested)) {
                return nested;
            }
        }
    }

    return payload;
}

function normalizeSummary(rawSummary) {
    const raw = rawSummary?.data ?? rawSummary ?? {};
    const summary = {
        ...raw,
        ...statusCountsFromArray(raw)
    };
    const normalized = {
        ...summary,
        totalSent: looseNumber(summary, [
            "totalSent",
            "sent",
            "sentCount",
            "sentMessages",
            "totalMessagesSent",
            "messagesSent",
            "totalMessages",
            "totalMessageCount",
            "messageCount"
        ]),
        totalDelivered: looseNumber(summary, [
            "totalDelivered",
            "delivered",
            "deliveredCount",
            "deliveredMessages",
            "totalMessagesDelivered",
            "messagesDelivered"
        ]),
        totalRead: looseNumber(summary, [
            "totalRead",
            "read",
            "readCount",
            "readMessages",
            "totalMessagesRead",
            "messagesRead",
            "seen",
            "seenCount",
            "seenMessages"
        ]),
        totalFailed: looseNumber(summary, [
            "totalFailed",
            "failed",
            "failedCount",
            "failedMessages",
            "totalMessagesFailed",
            "messagesFailed",
            "errorCount",
            "errors"
        ]),
        deliveryRate: looseNumber(summary, [
            "deliveryRate",
            "deliveredRate",
            "deliveryPercentage",
            "deliveredPercentage",
            "deliveryPercent"
        ], { percentage: true }),
        readRate: looseNumber(summary, [
            "readRate",
            "seenRate",
            "readPercentage",
            "seenPercentage",
            "readPercent"
        ], { percentage: true }),
        failureRate: looseNumber(summary, [
            "failureRate",
            "failedRate",
            "failurePercentage",
            "failedPercentage",
            "failurePercent"
        ], { percentage: true }),
        messagesSentToday: looseNumber(summary, [
            "messagesSentToday",
            "sentToday",
            "todaySent",
            "todaySentCount",
            "sentCountToday"
        ]),
        messagesDeliveredToday: looseNumber(summary, [
            "messagesDeliveredToday",
            "deliveredToday",
            "todayDelivered",
            "todayDeliveredCount",
            "deliveredCountToday"
        ]),
        messagesReadToday: looseNumber(summary, [
            "messagesReadToday",
            "readToday",
            "todayRead",
            "todayReadCount",
            "readCountToday",
            "seenToday"
        ])
    };

    const safePercent = (value, total) => {
        if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
            return null;
        }
        return (value / total) * 100;
    };

    normalized.deliveryRate =
        normalized.deliveryRate ??
        safePercent(normalized.totalDelivered, normalized.totalSent);
    normalized.readRate =
        normalized.readRate ??
        safePercent(normalized.totalRead, normalized.totalSent);
    normalized.failureRate =
        normalized.failureRate ??
        safePercent(normalized.totalFailed, normalized.totalSent);

    return normalized;
}

function normalizeReportRow(row, page, index) {
    const id = firstDefined(
        row.id,
        row.reportId,
        row.whatsappMessageId,
        row.messageId,
        row.externalMessageId,
        `${page}-${index}`
    );

    return {
        ...row,
        id,
        whatsappMessageId: firstDefined(
            row.whatsappMessageId,
            row.waMessageId,
            row.messageId,
            row.externalMessageId
        ),
        phoneNumber: firstDefined(
            row.phoneNumber,
            row.contactPhoneNumber,
            row.fromPhoneNumber,
            row.from,
            row.sender
        ),
        toPhoneNumber: firstDefined(
            row.toPhoneNumber,
            row.recipientPhoneNumber,
            row.to,
            row.recipient
        ),
        templateName: firstDefined(row.templateName, row.template, row.templateCode),
        messageType: firstDefined(row.messageType, row.type, row.category),
        currentStatus: firstDefined(row.currentStatus, row.status, row.messageStatus),
        sentAt: firstDefined(row.sentAt, row.sentTime, row.createdAt),
        deliveredAt: firstDefined(row.deliveredAt, row.deliveredTime),
        readAt: firstDefined(row.readAt, row.readTime, row.seenAt),
        failedAt: firstDefined(row.failedAt, row.failedTime),
        failureReason: firstDefined(row.failureReason, row.errorMessage, row.error),
        body: firstDefined(row.body, row.messageBody, row.text, row.content)
    };
}

function normalizeMessagePage(response, page) {
    const payload = response.data ?? {};
    const rows = findNestedArray(payload);
    const totalElements = findTotalElements(payload, rows.length);
    const normalizedRows = rows.map((row, index) => normalizeReportRow(row, page, index));

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
            const summaryData = normalizeSummary(findSummaryPayload(response.data));
            // if (isMountedRef.current) {
                setSummary(summaryData);
                setSummaryUpdatedAt(new Date());
            // }
            setSummaryLoading(false);
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
            const pageData = normalizeMessagePage(response, page);
            // if (isMountedRef.current) {
                setMessages(pageData.rows);
                setRowCount(pageData.totalElements);
                setTableUpdatedAt(new Date());
            // }
            setTableLoading(false);
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
    }, [queryParams, page]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            loadSummary();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [loadSummary, refreshIndex]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            loadMessages();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [loadMessages, refreshIndex]);

    const applyFilters = useCallback(
        (nextFilters = filters) => {
            setActiveFilters(nextFilters);
            setPage(0);
            // Force immediate refresh to bypass debounce
            setRefreshIndex((current) => current + 1);
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
