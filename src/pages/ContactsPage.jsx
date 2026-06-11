import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import SideNav from "../components/layout/SideNav";
import TopBar from "../components/layout/TopBar";
import MarqButton from "../components/common/MarqButton";
import ContactList from "../components/contacts/ContactList";
import ContactListFilters, {
    DATE_RANGE_OPTIONS
} from "../components/contacts/ContactListFilters";
import CreateContactModal from "../components/contacts/CreateContactModal";
import {
    createContact,
    listContacts,
    normalizeContactPage
} from "../api/contactApi";
import { parseTimestamp } from "../utils/time";

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_SORT = "createdAt,desc";

function withinLastDays(iso, days) {
    const ts = parseTimestamp(iso);
    if (!ts) return false;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return ts.getTime() >= cutoff;
}

// Server-side filter is best-effort: we always send `search` (the backend
// can ignore it), and we send `createdAfter` for date ranges. The actual
// filtering still happens client-side too, so the contract is loose.
function buildServerQuery({ search, dateRange }) {
    const range = DATE_RANGE_OPTIONS.find((option) => option.value === dateRange);
    const createdAfter =
        range?.days
            ? new Date(Date.now() - range.days * 24 * 60 * 60 * 1000).toISOString()
            : null;
    return {
        search: search.trim(),
        createdAfter
    };
}

// Client-side filter applied to the loaded pages. This is the safety net
// for when the backend doesn't implement search / date range.
function applyClientFilters(contacts, { search, dateRange }) {
    const trimmed = search.trim().toLowerCase();
    const range = DATE_RANGE_OPTIONS.find((option) => option.value === dateRange);
    return contacts.filter((contact) => {
        if (trimmed) {
            const haystack = [
                contact.name,
                contact.phoneNumber,
                contact.email,
                contact.notes
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            if (!haystack.includes(trimmed)) return false;
        }
        if (range?.days) {
            const ts =
                contact.createdAt ||
                contact.updatedAt ||
                contact.lastContactedAt;
            if (!withinLastDays(ts, range.days)) return false;
        }
        return true;
    });
}

// Client-side sort. Backend `sort` is the primary driver; this is a
// tie-breaker / fallback for fields it doesn't support.
function clientSort(contacts, sort) {
    const [field, dir] = sort.split(",");
    const factor = dir === "asc" ? 1 : -1;
    return [...contacts].sort((a, b) => {
        const av = a?.[field];
        const bv = b?.[field];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number" && typeof bv === "number") {
            return (av - bv) * factor;
        }
        const at = parseTimestamp(av)?.getTime();
        const bt = parseTimestamp(bv)?.getTime();
        if (at && bt) return (at - bt) * factor;
        return String(av).localeCompare(String(bv)) * factor;
    });
}

function dedupeById(list) {
    const seen = new Set();
    const out = [];
    for (const item of list) {
        const key = item.id || item.contactId || item.phoneNumber;
        if (!key) {
            out.push(item);
            continue;
        }
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(item);
    }
    return out;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(DEFAULT_PAGE_SIZE);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(DEFAULT_SORT);
    const [dateRange, setDateRange] = useState("all");

    const [createOpen, setCreateOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // Track whether a request is in flight so the IntersectionObserver
    // doesn't fire duplicate loads.
    const inFlightRef = useRef(false);
    const sentinelRef = useRef(null);

    // Reset to page 0 whenever the query changes.
    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");
        setContacts([]);
        setHasMore(false);
        setPage(0);
        inFlightRef.current = false;

        const serverQuery = buildServerQuery({ search, dateRange });

        listContacts({
            page: 0,
            size: pageSize,
            sort,
            ...serverQuery
        })
            .then((response) => {
                if (!active) return;
                const pageData = normalizeContactPage(response);
                setContacts(dedupeById(pageData.items));
                setTotalElements(pageData.totalElements);
                setHasMore(pageData.hasMore);
                setPage(0);
            })
            .catch((err) => {
                console.error(err);
                if (active) {
                    setError(
                        err?.response?.data?.message ||
                            err?.message ||
                            "Failed to load contacts"
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                    inFlightRef.current = false;
                }
            });

        return () => {
            active = false;
        };
    }, [search, dateRange, sort, pageSize]);

    // Load a specific page and append. Used by the IntersectionObserver.
    const loadPage = useCallback(
        async (nextPage) => {
            if (inFlightRef.current || !hasMore) return;
            inFlightRef.current = true;
            setLoadingMore(true);
            setError("");

            try {
                const serverQuery = buildServerQuery({ search, dateRange });
                const response = await listContacts({
                    page: nextPage,
                    size: pageSize,
                    sort,
                    ...serverQuery
                });
                const pageData = normalizeContactPage(response);
                setContacts((prev) =>
                    dedupeById([...prev, ...pageData.items])
                );
                setTotalElements(pageData.totalElements);
                setHasMore(pageData.hasMore);
                setPage(nextPage);
            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.message ||
                        err?.message ||
                        "Failed to load more contacts"
                );
            } finally {
                setLoadingMore(false);
                inFlightRef.current = false;
            }
        },
        [hasMore, pageSize, search, dateRange, sort]
    );

    // IntersectionObserver: when the sentinel scrolls into view, request
    // the next page. We keep the observer in a ref and only re-create it
    // when the loading flags change.
    useEffect(() => {
        const node = sentinelRef.current;
        if (!node) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (!entry?.isIntersecting) return;
                if (loading || loadingMore) return;
                if (!hasMore) return;
                loadPage(page + 1);
            },
            { rootMargin: "200px 0px" }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [loadPage, loading, loadingMore, hasMore, page]);

    const filteredContacts = useMemo(
        () => clientSort(applyClientFilters(contacts, { search, dateRange }), sort),
        [contacts, search, dateRange, sort]
    );

    const handleCreate = async (payload) => {
        const response = await createContact(payload);
        const created =
            response.data?.data ??
            {
                id: response.data?.id || `local-${Date.now()}`,
                ...payload,
                createdAt: new Date().toISOString()
            };
        // Prepend to the accumulator. If the server is sorted by
        // `createdAt,desc`, the new contact belongs on page 0 — putting it
        // at the front matches what a refresh would show.
        setContacts((prev) => dedupeById([created, ...prev]));
        setTotalElements((value) => value + 1);
        setCreateOpen(false);
        setToast({ severity: "success", message: `Saved “${payload.name}”` });
    };

    const showingLabel =
        contacts.length === totalElements || !totalElements
            ? `${totalElements || contacts.length} contact${
                  totalElements === 1 ? "" : "s"
              }`
            : `${contacts.length} of ${totalElements} contacts`;

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
                        overflow: "hidden",
                        px: { xs: 2.5, md: 4 },
                        py: { xs: 2.5, md: 4 }
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: { xs: "flex-start", md: "center" },
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 2,
                            mb: 3
                        }}
                    >
                        <Box>
                            <Box
                                sx={{
                                    fontSize: 12,
                                    color: "text.secondary",
                                    fontWeight: 800,
                                    letterSpacing: 1.6,
                                    textTransform: "uppercase",
                                    mb: 0.5
                                }}
                            >
                                Contacts
                            </Box>
                            <Box sx={{ fontSize: 30, fontWeight: 800 }}>
                                Your contact book
                            </Box>
                        </Box>

                        <MarqButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setCreateOpen(true)}
                            sx={{
                                bgcolor: "#B9AEFF",
                                color: "#020B1F",
                                fontWeight: 800,
                                px: 3,
                                minHeight: 52,
                                borderRadius: 2,
                                letterSpacing: 0.4,
                                "&:hover": { bgcolor: "#C9C2FF" }
                            }}
                        >
                            Add contact
                        </MarqButton>
                    </Box>

                    <ContactListFilters
                        search={search}
                        onSearchChange={setSearch}
                        sort={sort}
                        onSortChange={setSort}
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        totalCount={totalElements}
                        filteredCount={filteredContacts.length}
                    />

                    <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <ContactList
                            contacts={filteredContacts}
                            loading={loading}
                            onCreateClick={() => setCreateOpen(true)}
                            hasMore={hasMore}
                            loadingMore={loadingMore}
                            sentinelRef={sentinelRef}
                        />
                    </Box>

                    <Box
                        sx={{
                            pt: 1.5,
                            color: "text.secondary",
                            fontSize: 12,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2
                        }}
                    >
                        <span>{showingLabel}</span>
                        {hasMore && !loading && (
                            <span>Scroll to load more</span>
                        )}
                    </Box>
                </Box>
            </Box>

            <CreateContactModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreate={handleCreate}
            />

            <Snackbar
                open={Boolean(toast)}
                autoHideDuration={3500}
                onClose={() => setToast(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                {toast ? (
                    <Alert
                        onClose={() => setToast(null)}
                        severity={toast.severity}
                        sx={{ borderRadius: 2 }}
                    >
                        {toast.message}
                    </Alert>
                ) : null}
            </Snackbar>
        </Box>
    );
}
