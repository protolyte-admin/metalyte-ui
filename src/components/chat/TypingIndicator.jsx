import { Box, Typography } from "@mui/material";

export default function TypingIndicator({ name = "Contact" }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 1 }}>
            <Box sx={{ display: "flex", gap: 0.5 }}>
                {[0, 1, 2].map((dot) => (
                    <Box
                        key={dot}
                        sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            bgcolor: "#8E97B2",
                            opacity: 0.65
                        }}
                    />
                ))}
            </Box>
            <Typography sx={{ color: "#727C9C", fontSize: 13, fontStyle: "italic" }}>
                {name} is typing...
            </Typography>
        </Box>
    );
}
