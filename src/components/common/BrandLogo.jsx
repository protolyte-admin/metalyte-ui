import { Box } from "@mui/material";

import metalyteLogo from "../../assets/metalyte-logo.png";

export default function BrandLogo({ compact = false, sx, imageSx }) {
    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: compact ? 56 : 220,
                height: compact ? 34 : 72,
                overflow: "hidden",
                borderRadius: compact ? 1.5 : 1,
                bgcolor: "#000000",
                boxShadow: compact ? "0 10px 24px rgba(47,24,246,0.2)" : "none",
                ...sx
            }}
        >
            <Box
                component="img"
                src={metalyteLogo}
                alt="Metalyte"
                sx={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: compact ? "left center" : "center",
                    ...imageSx
                }}
            />
        </Box>
    );
}