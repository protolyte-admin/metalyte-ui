import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useMemo } from "react";

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
                    <Button variant="contained" onClick={onApply} disabled={loading}>
                        Apply Filters
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="From Date"
                        type="date"
                        size="small"
                        value={filters.fromDate}
                        onChange={(event) => onChange({ ...filters, fromDate: event.target.value })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="To Date"
                        type="date"
                        size="small"
                        value={filters.toDate}
                        onChange={(event) => onChange({ ...filters, toDate: event.target.value })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
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
                        fullWidth
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
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
