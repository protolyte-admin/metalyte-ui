import { Box, Button, Chip, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import { useMemo } from "react";
import { formatPhoneNumber } from "../../utils/format";
import Grid from "@mui/material/Grid";


const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "SENT", label: "Sent" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "READ", label: "Read" },
    { value: "FAILED", label: "Failed" }
];

const MESSAGE_TYPE_OPTIONS = [
    { value: "", label: "All Types" },
    { value: "TEXT", label: "Text" },
    { value: "MEDIA", label: "Media" },
    { value: "TEMPLATE", label: "Template" },
    { value: "HSM", label: "HSM" }
];

// Returns the IST calendar date in YYYY-MM-DD form so the native <input
// type="date"> can consume it directly. Backend expects this format too.
function istDateString(date) {
    const fmt = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata"
    });
    return fmt.format(date);
}

function shiftDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

const QUICK_RANGES = [
    {
        key: "today",
        label: "Today",
        resolve: (now) => {
            const today = istDateString(now);
            return { fromDate: today, toDate: today };
        }
    },
    {
        key: "yesterday",
        label: "Yesterday",
        resolve: (now) => {
            const y = shiftDays(now, -1);
            const yIso = istDateString(y);
            return { fromDate: yIso, toDate: yIso };
        }
    },
    {
        key: "last7",
        label: "Last 7 days",
        resolve: (now) => ({
            fromDate: istDateString(shiftDays(now, -6)),
            toDate: istDateString(now)
        })
    },
    {
        key: "last30",
        label: "Last 30 days",
        resolve: (now) => ({
            fromDate: istDateString(shiftDays(now, -29)),
            toDate: istDateString(now)
        })
    },
    {
        key: "thisMonth",
        label: "This month",
        resolve: (now) => {
            const fmt = new Intl.DateTimeFormat("en-CA", {
                year: "numeric",
                month: "2-digit",
                timeZone: "Asia/Kolkata"
            });
            const parts = fmt.formatToParts(now);
            const y = parts.find((p) => p.type === "year")?.value;
            const m = parts.find((p) => p.type === "month")?.value;
            const first = `${y}-${m}-01`;
            // Last day of the month: jump to next month's day 0.
            const lastDate = new Date(Date.UTC(Number(y), Number(m), 0));
            const last = istDateString(lastDate);
            return { fromDate: first, toDate: last };
        }
    }
];

const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS.map((opt) => [opt.value, opt.label]));
const MESSAGE_TYPE_LABELS = Object.fromEntries(MESSAGE_TYPE_OPTIONS.map((opt) => [opt.value, opt.label]));

function buildActiveChips(filters) {
    const chips = [];
    if (filters.fromDate || filters.toDate) {
        const label = [filters.fromDate || "…", filters.toDate || "…"].join(" → ");
        chips.push({ key: "dateRange", label: `Date: ${label}`, field: null });
    }
    if (filters.status) {
        chips.push({ key: "status", label: `Status: ${STATUS_LABELS[filters.status] || filters.status}`, field: "status" });
    }
    if (filters.messageType) {
        chips.push({ key: "messageType", label: `Type: ${MESSAGE_TYPE_LABELS[filters.messageType] || filters.messageType}`, field: "messageType" });
    }
    if (filters.phoneNumber) {
        chips.push({ key: "phoneNumber", label: `Phone: ${filters.phoneNumber}`, field: "phoneNumber" });
    }
    if (filters.templateName) {
        chips.push({ key: "templateName", label: `Template: ${filters.templateName}`, field: "templateName" });
    }
    if (filters.campaign) {
        chips.push({ key: "campaign", label: `Campaign: ${filters.campaign}`, field: "campaign" });
    }
    return chips;
}

export default function ReportsFilters({ filters, onChange, onApply, onReset, loading }) {
    const canReset = useMemo(
        () =>
            Boolean(
                filters.fromDate ||
                    filters.toDate ||
                    filters.status ||
                    filters.messageType ||
                    filters.phoneNumber ||
                    filters.templateName ||
                    filters.campaign
            ),
        [filters]
    );

    const activeChips = useMemo(() => buildActiveChips(filters), [filters]);

    const handleQuickRange = (range) => {
        const next = { ...filters, ...range.resolve(new Date()) };
        onChange(next);
        onApply(next);
    };

    const handleRemoveChip = (chip) => {
        if (chip.key === "dateRange") {
            onChange({ ...filters, fromDate: "", toDate: "" });
            return;
        }
        onChange({ ...filters, [chip.field]: "" });
    };

    return (
        <Box
            sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)"
            }}
        >
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <Box>
                    <Typography variant="h6">Filters</Typography>
                    <Typography color="text.secondary" variant="body2">
                        Narrow down your report by date, status, or campaign.
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button variant="outlined" onClick={onReset} disabled={!canReset || loading}>
                        Reset Filters
                    </Button>
                    <Button variant="contained" onClick={() => onApply(filters)} disabled={loading}>
                        Apply Filters
                    </Button>
                </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap", gap: 1, rowGap: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center", mr: 1, display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                    <EventIcon sx={{ fontSize: 14 }} />
                    Quick range:
                </Typography>
                {QUICK_RANGES.map((range) => {
                    const next = range.resolve(new Date());
                    const active = filters.fromDate === next.fromDate && filters.toDate === next.toDate;
                    return (
                        <Chip
                            key={range.key}
                            label={range.label}
                            size="small"
                            clickable
                            color={active ? "primary" : "default"}
                            variant={active ? "filled" : "outlined"}
                            onClick={() => handleQuickRange(range)}
                            disabled={loading}
                            sx={{ fontWeight: 600 }}
                        />
                    );
                })}
            </Stack>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="From Date"
                        type="date"
                        size="small"
                        value={filters.fromDate}
                        onChange={(event) => onChange({ ...filters, fromDate: event.target.value })}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                        sx={{ minWidth: 140 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="To Date"
                        type="date"
                        size="small"
                        value={filters.toDate}
                        onChange={(event) => onChange({ ...filters, toDate: event.target.value })}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                        sx={{ minWidth: 140 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Status"
                        select
                        size="small"
                        value={filters.status}
                        onChange={(event) => onChange({ ...filters, status: event.target.value })}
                        fullWidth
                        sx={{ minWidth: 140 }}
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Message Type"
                        select
                        size="small"
                        value={filters.messageType}
                        onChange={(event) => onChange({ ...filters, messageType: event.target.value })}
                        fullWidth
                        sx={{ minWidth: 160 }}
                    >
                        {MESSAGE_TYPE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Phone Number"
                        placeholder="Search by phone"
                        size="small"
                        value={filters.phoneNumber}
                        onChange={(event) => onChange({ ...filters, phoneNumber: event.target.value })}
                        onBlur={(event) => {
                            const formatted = formatPhoneNumber(event.target.value);
                            // Only commit if formatting actually changed something
                            // visible (i.e. we kept the digits).
                            if (formatted && formatted !== event.target.value) {
                                onChange({ ...filters, phoneNumber: formatted });
                            }
                        }}
                        fullWidth
                        sx={{ minWidth: 140 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Template Name"
                        placeholder="Search by template"
                        size="small"
                        value={filters.templateName}
                        onChange={(event) => onChange({ ...filters, templateName: event.target.value })}
                        fullWidth
                        sx={{ minWidth: 140 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Campaign"
                        placeholder="Search by campaign"
                        size="small"
                        value={filters.campaign}
                        onChange={(event) => onChange({ ...filters, campaign: event.target.value })}
                        fullWidth
                        sx={{ minWidth: 140 }}
                    />
                </Grid>
            </Grid>

            {activeChips.length > 0 ? (
                <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, rowGap: 1, alignItems: "center" }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mr: 0.5 }}>
                            Active:
                        </Typography>
                        {activeChips.map((chip) => (
                            <Chip
                                key={chip.key}
                                size="small"
                                color="primary"
                                label={chip.label}
                                onDelete={() => handleRemoveChip(chip)}
                                deleteIcon={
                                    <Tooltip title="Remove">
                                        <CloseIcon fontSize="small" />
                                    </Tooltip>
                                }
                            />
                        ))}
                        <Button
                            size="small"
                            color="inherit"
                            onClick={onReset}
                            disabled={!canReset || loading}
                            sx={{ ml: "auto", textTransform: "none" }}
                        >
                            Clear all
                        </Button>
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
}
