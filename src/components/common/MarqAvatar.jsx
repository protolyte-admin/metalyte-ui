import { Avatar, Box } from "@mui/material";

export default function MarqAvatar({
    online = false,
    size = 44,
    sx,
    children,
    ...props
}) {
    return (
        <Box
            sx={{
                position: "relative",
                width: size,
                height: size,
                flex: "0 0 auto"
            }}
        >
            <Avatar
                sx={{
                    width: size,
                    height: size,
                    bgcolor: "#2B3B57",
                    color: "#F5F7FF",
                    border: "1px solid rgba(185,174,255,0.34)",
                    fontWeight: 700,
                    ...sx
                }}
                {...props}
            >
                {children}
            </Avatar>
            {online && (
                <Box
                    sx={{
                        position: "absolute",
                        right: 0,
                        bottom: 1,
                        width: Math.max(10, size * 0.22),
                        height: Math.max(10, size * 0.22),
                        borderRadius: "50%",
                        bgcolor: "#00D26A",
                        border: "2px solid #08162F"
                    }}
                />
            )}
        </Box>
    );
}
