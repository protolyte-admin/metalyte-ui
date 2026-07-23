import { Card } from "@mui/material";

export default function MarqCard({ sx, ...props }) {
    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                    "linear-gradient(145deg, rgba(12,19,36,0.98), rgba(5,10,24,0.98))",
                boxShadow: "0 28px 80px rgba(0,0,0,0.42)",
                ...sx
            }}
            {...props}
        />
    );
}
