import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BarChartIcon from "@mui/icons-material/BarChart";
import ContactsIcon from "@mui/icons-material/Contacts";
import InboxIcon from "@mui/icons-material/Inbox";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BrandLogo from "../common/BrandLogo";
import MarqAvatar from "../common/MarqAvatar";
import { useAuth } from "../../context/useAuth";

const navItems = [
    { label: "Inbox", icon: <InboxIcon />, path: "/" },
    { label: "Reports", icon: <BarChartIcon />, path: "/reports" },
    { label: "Contacts", icon: <ContactsIcon />, path: "/contacts" },
    { label: "Billing & Subscription", icon: <ReceiptLongOutlinedIcon />, path: "/billing" }
];

function isActive(item, location) {
    if (item.path === "/") {
        return location.pathname === "/";
    }
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
}

export default function SideNav() {
    const { logout, user, organization } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/logout", { replace: true });
    };

    const labelDisplay = {
        xs: "none",
        md: collapsed ? "none" : "block"
    };

    const buttonJustify = {
        xs: "center",
        md: collapsed ? "center" : "flex-start"
    };

    const iconMargin = {
        xs: 0,
        md: collapsed ? 0 : 1.5
    };

    return (
        <Box
            sx={{
                width: {
                    xs: 84,
                    md: collapsed ? 88 : 320
                },
                flex: "0 0 auto",
                background: "#050A18",
                borderRight: "1px solid rgba(255,255,255,0.09)",
                display: "flex",
                flexDirection: "column",
                transition: "width 180ms ease"
            }}
        >
            <Box sx={{ p: { xs: 2, md: collapsed ? 2 : 2.25 } }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: collapsed ? "center" : "flex-start",
                        gap: 1.5
                    }}
                >
                    <BrandLogo
                        compact={collapsed}
                        sx={{
                            width: collapsed ? 48 : 210,
                            height: collapsed ? 34 : 68,
                            flex: "0 0 auto"
                        }}
                    />

                    <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
                        <IconButton
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            onClick={() => setCollapsed((value) => !value)}
                            sx={{
                                display: { xs: "none", md: "inline-flex" },
                                ml: collapsed ? 0 : "auto",
                                width: 38,
                                height: 38,
                                color: "#FFFFFF",
                                bgcolor: "rgba(47,24,246,0.18)",
                                "&:hover": {
                                    bgcolor: "rgba(47,24,246,0.3)"
                                }
                            }}
                        >
                            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
                <Typography
                    sx={{
                        display: labelDisplay,
                        color: "#BBC3D8",
                        fontSize: 15,
                        mt: 1,
                        ml: 0.25
                    }}
                >
                    Business Communication
                </Typography>
            </Box>

            <Box sx={{ px: { xs: 1.5, md: collapsed ? 1.25 : 2 }, mt: 1.5 }}>
                {navItems.map((item) => {
                    const active = isActive(item, location);
                    const enabled = Boolean(item.path);
                    return (
                        <Tooltip key={item.label} title={collapsed ? item.label : ""} placement="right">
                            <Button
                                fullWidth
                                startIcon={item.icon}
                                onClick={() => enabled && navigate(item.path)}
                                disabled={!enabled}
                                sx={{
                                    justifyContent: buttonJustify,
                                    minHeight: 58,
                                    mb: 1,
                                    px: { xs: 0, md: collapsed ? 0 : 2 },
                                    bgcolor: active ? "rgba(47,24,246,0.2)" : "transparent",
                                    color: active ? "#FFFFFF" : "#D7DBEA",
                                    borderRight: active ? "2px solid #2F18F6" : "2px solid transparent",
                                    "& .MuiButton-startIcon": {
                                        mr: iconMargin
                                    },
                                    "&:hover": {
                                        bgcolor: enabled ? "rgba(47,24,246,0.16)" : "transparent"
                                    }
                                }}
                            >
                                <Box component="span" sx={{ display: labelDisplay }}>
                                    {item.label}
                                </Box>
                            </Button>
                        </Tooltip>
                    );
                })}
            </Box>

            <Box sx={{ flex: 1 }} />

            <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.09)", p: { xs: 1.5, md: collapsed ? 1.25 : 2 } }}>
                <Tooltip title={collapsed ? "Logout" : ""} placement="right">
                    <Button
                        fullWidth
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent: buttonJustify,
                            color: "#D7DBEA",
                            mb: 3,
                            px: { xs: 0, md: collapsed ? 0 : 2 },
                            "& .MuiButton-startIcon": {
                                mr: iconMargin
                            }
                        }}
                    >
                        <Box component="span" sx={{ display: labelDisplay }}>
                            Logout
                        </Box>
                    </Button>
                </Tooltip>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: { xs: 0, md: collapsed ? 0 : 1 },
                        justifyContent: buttonJustify
                    }}
                >
                    <MarqAvatar size={40}>
                        {(user?.fullName || user?.name || user?.email || "N").slice(0, 1).toUpperCase()}
                    </MarqAvatar>
                    <Box sx={{ display: labelDisplay, minWidth: 0 }}>
                        <Typography
                            sx={{
                                color: "text.primary",
                                fontSize: 18,
                                lineHeight: 1.15,
                                fontWeight: 800,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {user?.fullName || user?.name || user?.email || "Name"}
                        </Typography>
                        <Typography
                            sx={{
                                color: "text.secondary",
                                fontSize: 13,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {organization?.name || "Organization Name"}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                            {user?.role || "Role"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}