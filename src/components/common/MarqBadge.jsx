import { Box } from "@mui/material";

export default function MarqBadge({ children, sx }) {
    return (
        <Box
            component="span"
            sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 22,
                px: 1.25,
                borderRadius: 99,
                bgcolor: "#FFFFFF",
                color: "#050A18",
                fontSize: 12,
                fontWeight: 800,
                lineHeight: 1,
                ...sx
            }}
        >
            {children}
        </Box>
    );
}
