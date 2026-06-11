import { Card } from "@mui/material";

export default function MarqCard({ sx, ...props }) {
    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                    "linear-gradient(145deg, rgba(22,35,61,0.96), rgba(14,25,46,0.98))",
                boxShadow: "0 28px 80px rgba(0,0,0,0.34)",
                ...sx
            }}
            {...props}
        />
    );
}
