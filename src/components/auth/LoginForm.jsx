import {
    Box,
    CircularProgress,
    InputAdornment,
    Link,
    Typography
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import MarqButton from "../common/MarqButton";
import MarqInput from "../common/MarqInput";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginForm({
    email,
    password,
    loading,
    onEmailChange,
    onPasswordChange,
    onSubmit
}) {
    return (
        <Box
            component="form"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    color: "text.primary",
                    fontSize: {
                        xs: 28,
                        sm: 32
                    }
                }}
            >
                Welcome back
            </Typography>

            <Typography
                sx={{
                    color: "text.secondary",
                    fontSize: 13,
                    fontWeight: 800,
                    mb: 1.25,
                    letterSpacing: 1.4
                }}
            >
                EMAIL ADDRESS
            </Typography>

            <MarqInput
                placeholder="name@company.com"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                autoComplete="email"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ color: "#C7C9DF" }} />
                        </InputAdornment>
                    )
                }}
                sx={{ mb: 3 }}
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 1.25
                }}
            >
                <Typography
                    sx={{
                        color: "text.secondary",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: 1.4
                    }}
                >
                    PASSWORD
                </Typography>
                <Link
                    component="button"
                    type="button"
                    underline="none"
                    sx={{
                        color: "#CDC7FF",
                        fontSize: 13,
                        fontWeight: 800
                    }}
                >
                    Forgot Password?
                </Link>
            </Box>

            <MarqInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                autoComplete="current-password"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ color: "#C7C9DF" }} />
                        </InputAdornment>
                    )
                }}
                sx={{ mb: 3.5 }}
            />

            <MarqButton
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                    minHeight: 64,
                    mb: 4,
                    fontSize: 18
                }}
            >
                {loading ? (
                    <>
                        <CircularProgress size={20} sx={{ mr: 1.25 }} />
                        Authenticating...
                    </>
                ) : (
                    "Sign In"
                )}
            </MarqButton>

            {/* <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    gap: 2,
                    alignItems: "center",
                    mb: 4
                }}
            >
                <Box sx={{ height: 1, bgcolor: "rgba(255,255,255,0.16)" }} />
                <Typography
                    sx={{
                        color: "#9EA6C0",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: 1
                    }}
                >
                    OR CONTINUE WITH
                </Typography>
                <Box sx={{ height: 1, bgcolor: "rgba(255,255,255,0.16)" }} />
            </Box>

            <SocialLoginButtons /> */}
        </Box>
    );
}
