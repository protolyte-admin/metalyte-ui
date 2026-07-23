import {
    Box,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const SORT_OPTIONS = [
    { value: "createdAt,desc", label: "Newest first" },
    { value: "createdAt,asc", label: "Oldest first" },
    { value: "name,asc", label: "Name A → Z" },
    { value: "name,desc", label: "Name Z → A" },
    { value: "phoneNumber,asc", label: "Phone ↑" },
    { value: "phoneNumber,desc", label: "Phone ↓" },
    { value: "lastContactedAt,desc", label: "Recently contacted" },
    { value: "lastContactedAt,asc", label: "Least recently contacted" }
];

const DATE_RANGE_OPTIONS = [
    { value: "all", label: "All time", days: null },
    { value: "7d", label: "Last 7 days", days: 7 },
    { value: "30d", label: "Last 30 days", days: 30 },
    { value: "90d", label: "Last 90 days", days: 90 }
];

export default function ContactListFilters({
    search,
    onSearchChange,
    sort,
    onSortChange,
    dateRange,
    onDateRangeChange,
    totalCount,
    filteredCount
}) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                gap: 2,
                mb: 3
            }}
        >
            <TextField
                size="small"
                placeholder="Search name, phone, email…"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#A8B0D0", fontSize: 19 }} />
                            </InputAdornment>
                        )
                    }
                }}
                sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                        height: 44,
                        bgcolor: "#08162F"
                    }
                }}
            />

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {DATE_RANGE_OPTIONS.map((option) => {
                    const selected = dateRange === option.value;
                    return (
                        <Box
                            key={option.value}
                            onClick={() => onDateRangeChange(option.value)}
                            sx={{
                                px: 1.75,
                                py: 0.85,
                                borderRadius: 99,
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 700,
                                letterSpacing: 0.4,
                                border: "1px solid",
                                borderColor: selected
                                    ? "transparent"
                                    : "rgba(255,255,255,0.12)",
                                bgcolor: selected ? "#FFFFFF" : "transparent",
                                color: selected ? "#020B1F" : "#C7CBE0",
                                transition: "all 140ms ease",
                                "&:hover": {
                                    borderColor: selected
                                        ? "transparent"
                                        : "rgba(185,174,255,0.4)"
                                }
                            }}
                        >
                            {option.label}
                        </Box>
                    );
                })}
            </Box>

            <Select
                size="small"
                value={sort}
                onChange={(event) => onSortChange(event.target.value)}
                IconComponent={ArrowDropDownIcon}
                sx={{
                    minWidth: 200,
                    height: 44,
                    bgcolor: "#08162F",
                    "& .MuiSelect-select": { fontSize: 14, fontWeight: 600 }
                }}
            >
                {SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        Sort: {option.label}
                    </MenuItem>
                ))}
            </Select>

            <Typography
                sx={{
                    color: "text.secondary",
                    fontSize: 13,
                    whiteSpace: "nowrap"
                }}
            >
                {filteredCount} of {totalCount}
            </Typography>
        </Box>
    );
}

export { DATE_RANGE_OPTIONS, SORT_OPTIONS };
