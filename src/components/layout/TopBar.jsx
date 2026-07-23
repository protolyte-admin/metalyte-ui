import { Box, Button, Divider, InputAdornment, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";

export default function TopBar({ onNewMessage }) {
    return (
        <Box
            sx={{
                height: 80,
                px: {
                    xs: 2,
                    md: 3
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "#01030A"
            }}
        >
            <TextField
                size="small"
                placeholder="Search conversations..."
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#C9CDE2", fontSize: 20 }} />
                            </InputAdornment>
                        )
                    }
                }}
                sx={{
                    width: {
                        xs: "100%",
                        sm: 320
                    },
                    maxWidth: 360,
                    "& .MuiOutlinedInput-root": {
                        height: 50,
                        bgcolor: "#121B31"
                    }
                }}
            />

            <Box
                sx={{
                    display: {
                        xs: "none",
                        sm: "flex"
                    },
                    alignItems: "center",
                    gap: 2
                }}
            >
                <NotificationsNoneIcon sx={{ color: "#D3D5E6", fontSize: 28 }} />
                <SearchIcon sx={{ color: "#D3D5E6", fontSize: 29 }} />
                <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.14)" }} />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onNewMessage}
                    disabled={!onNewMessage}
                    sx={{
                        px: 2.5,
                        minHeight: 50,
                        fontSize: 18
                    }}
                >
                    New Message
                </Button>
            </Box>
        </Box>
    );
}
