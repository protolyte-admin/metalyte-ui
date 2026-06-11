import { Box, Button } from "@mui/material";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";

export default function SocialLoginButtons() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr"
                },
                gap: 2
            }}
        >
            <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                    minHeight: 56,
                    bgcolor: "rgba(2,11,31,0.38)",
                    fontSize: 16
                }}
            >
                Google
            </Button>
            <Button
                variant="outlined"
                startIcon={<AppleIcon />}
                sx={{
                    minHeight: 56,
                    bgcolor: "rgba(2,11,31,0.38)",
                    fontSize: 16
                }}
            >
                Apple
            </Button>
        </Box>
    );
}
