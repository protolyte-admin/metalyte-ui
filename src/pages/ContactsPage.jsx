import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, App, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MarqButton from "../components/common/MarqButton";
import ContactList from "../components/contacts/ContactList";
import ContactListFilters, { DATE_RANGE_OPTIONS } from "../components/contacts/ContactListFilters";
import CreateContactModal from "../components/contacts/CreateContactModal";
import { createContact, listContacts, normalizeContactPage } from "../api/contactApi";
import { parseTimestamp } from "../utils/time";
import { tokens } from "../theme/tokens";

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_SORT = "createdAt,desc";

function withinLastDays(iso, days) {
    const ts = parseTimestamp(iso);
    if (!ts) return false;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return ts.getTime() >= cutoff;
}

function buildServerQuery({ search, dateRange }) {
    const range = DATE_RANGE_OPTIONS.find((option) => option.value === dateRange);
    return {
        search: search.trim(),
        createdAfter: range?.days
            ? new Date(Date.now() - range.days * 24 * 60 * 60 * 1000).toISOString()
            : null
    };
}

function applyClientFilters(contacts, { search, dateRange }) {
    const trimmed = search.trim().toLowerCase();
    const range = DATE_RANGE_OPTIONS.find((option) => option.value === dateRange);
    return contacts.filter((contact) => {
        if (trimmed) {
            const haystack = [contact.name, contact.phoneNumber, contact.email, contact.notes]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            if (!haystack.includes(trimmed)) return false;
        }
        if (range?.days) {
            const ts = contact.createdAt || contact.updatedAt || contact.lastContactedAt;
            if (!withinLastDays(ts, range.days)) return false;
        }
        return true;
    });
}

function clientSort(contacts, sort) {
    const [field, dir] = sort.split(",");
    const factor = dir === "asc" ? 1 : -1;
    return [...contacts].sort((a, b) => {
        const av = a?.[field];
        const bv = b?.[field];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * factor;
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
    const { message } = App.useApp();
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

    const inFlightRef = useRef(false);
    const sentinelRef = useRef(null);

    useEffect(() => {
        let active = true;
        const timer = window.setTimeout(() => {
            setLoading(true);
            setError("");
            setContacts([]);
            setHasMore(false);
            setPage(0);
            inFlightRef.current = false;

            listContacts({ page: 0, size: pageSize, sort, ...buildServerQuery({ search, dateRange }) })
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
                    if (active) setError(err?.response?.data?.message || err?.message || "Failed to load contacts");
                })
                .finally(() => {
                    if (active) {
                        setLoading(false);
                        inFlightRef.current = false;
                    }
                });
        }, 0);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [search, dateRange, sort, pageSize]);

    const loadPage = useCallback(async (nextPage) => {
        if (inFlightRef.current || !hasMore) return;
        inFlightRef.current = true;
        setLoadingMore(true);
        setError("");

        try {
            const response = await listContacts({
                page: nextPage,
                size: pageSize,
                sort,
                ...buildServerQuery({ search, dateRange })
            });
            const pageData = normalizeContactPage(response);
            setContacts((prev) => dedupeById([...prev, ...pageData.items]));
            setTotalElements(pageData.totalElements);
            setHasMore(pageData.hasMore);
            setPage(nextPage);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || err?.message || "Failed to load more contacts");
        } finally {
            setLoadingMore(false);
            inFlightRef.current = false;
        }
    }, [hasMore, pageSize, search, dateRange, sort]);

    useEffect(() => {
        const node = sentinelRef.current;
        if (!node) return undefined;
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (!entry?.isIntersecting || loading || loadingMore || !hasMore) return;
            loadPage(page + 1);
        }, { rootMargin: "200px 0px" });
        observer.observe(node);
        return () => observer.disconnect();
    }, [loadPage, loading, loadingMore, hasMore, page]);

    const filteredContacts = useMemo(
        () => clientSort(applyClientFilters(contacts, { search, dateRange }), sort),
        [contacts, search, dateRange, sort]
    );

    const handleCreate = async (payload) => {
        const response = await createContact(payload);
        const created = response.data?.data ?? {
            id: response.data?.id || `local-${Date.now()}`,
            ...payload,
            createdAt: new Date().toISOString()
        };
        setContacts((prev) => dedupeById([created, ...prev]));
        setTotalElements((value) => value + 1);
        setCreateOpen(false);
        message.success(`Saved "${payload.name}"`);
    };

    const showingLabel =
        contacts.length === totalElements || !totalElements
            ? `${totalElements || contacts.length} contact${totalElements === 1 ? "" : "s"}`
            : `${contacts.length} of ${totalElements} contacts`;

    return (
        <div className="contacts-page">
            <div className="page-header-row">
                <div>
                    <Typography.Text className="page-eyebrow">Contacts</Typography.Text>
                    <Typography.Title level={1} className="page-title">
                        Your contact book
                    </Typography.Title>
                </div>
                <MarqButton variant="contained" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
                    Add contact
                </MarqButton>
            </div>

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

            {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

            <div className="contacts-list-region">
                <ContactList
                    contacts={filteredContacts}
                    loading={loading}
                    onCreateClick={() => setCreateOpen(true)}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                    sentinelRef={sentinelRef}
                />
            </div>

            <Space className="contacts-footer" style={{ color: tokens.colors.textSecondary }}>
                <span>{showingLabel}</span>
                {hasMore && !loading && <span>Scroll to load more</span>}
            </Space>

            <CreateContactModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreate={handleCreate}
            />
        </div>
    );
}