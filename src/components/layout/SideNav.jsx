import { Avatar, Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BarChartIcon from "@mui/icons-material/BarChart";
import ContactsIcon from "@mui/icons-material/Contacts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpOutlineIcon from "@mui/icons-material/Help";
import InboxIcon from "@mui/icons-material/Inbox";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MarqAvatar from "../common/MarqAvatar";
import { useAuth } from "../../context/useAuth";

const navItems = [
    { label: "Inbox", icon: <InboxIcon />, path: "/" },
    { label: "Reports", icon: <BarChartIcon />, path: "/reports" },
    { label: "Contacts", icon: <ContactsIcon />, path: "/contacts" },
    { label: "Settings", icon: <SettingsIcon />, path: "/settings" }
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
        // logout() wipes storage + context. Then we REPLACE the current history
        // entry with /logout, then REPLACE again with /login. That way:
        //   stack before: [..., /inbox, currentProtected]
        //   stack after:  [..., /login]
        // Back from /login lands on whatever the user came from BEFORE login,
        // never on a protected URL.
        logout();
        navigate("/logout", { replace: true });
        // After the LogoutSuccess screen renders its "Return to Login" button,
        // it will call navigate("/login", { replace: true }).
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
                background: "#08162F",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                transition: "width 180ms ease"
            }}
        >
            <Box
                sx={{
                    p: {
                        xs: 2,
                        md: 2
                    }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: collapsed ? "center" : "flex-start",
                        gap: 2
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: "#B9AEFF",
                            color: "#020B1F",
                            borderRadius: 2,
                            width: 42,
                            height: 42
                        }}
                    >
                        <DashboardIcon />
                    </Avatar>

                    <Box sx={{ display: labelDisplay, minWidth: 0 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                color: "#DCD6FF",
                                fontSize: 30,
                                fontWeight: 800,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Metalyte
                        </Typography>
                        <Typography sx={{ color: "#8F98B6", fontSize: 18 }}>
                            Business Communication
                        </Typography>
                    </Box>

                    <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
                        <IconButton
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            onClick={() => setCollapsed((value) => !value)}
                            sx={{
                                display: {
                                    xs: "none",
                                    md: "inline-flex"
                                },
                                ml: collapsed ? 0 : "auto",
                                width: 38,
                                height: 38,
                                color: "#D3D5E6",
                                bgcolor: "rgba(255,255,255,0.04)",
                                "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.08)"
                                }
                            }}
                        >
                            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Box
                sx={{
                    px: {
                        xs: 1.5,
                        md: collapsed ? 1.25 : 2
                    },
                    mt: 2
                }}
            >
                {navItems.map((item) => {
                    const active = isActive(item, location);
                    const enabled = Boolean(item.path);
                    return (
                        <Tooltip
                            key={item.label}
                            title={collapsed ? item.label : ""}
                            placement="right"
                        >
                            <Button
                                fullWidth
                                startIcon={item.icon}
                                onClick={() => enabled && navigate(item.path)}
                                disabled={!enabled}
                                sx={{
                                    justifyContent: buttonJustify,
                                    minHeight: 60,
                                    mb: 1,
                                    px: {
                                        xs: 0,
                                        md: collapsed ? 0 : 2
                                    },
                                    bgcolor: active ? "#1B2A44" : "transparent",
                                    color: active ? "#DCD6FF" : "#D3D5E6",
                                    borderRight: active
                                        ? "2px solid #B9AEFF"
                                        : "2px solid transparent",
                                    "& .MuiButton-startIcon": {
                                        mr: iconMargin
                                    },
                                    "&:hover": {
                                        bgcolor: enabled ? "#1B2A44" : "transparent"
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

            <Box
                sx={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    p: {
                        xs: 1.5,
                        md: collapsed ? 1.25 : 2
                    }
                }}
            >
                <Tooltip title={collapsed ? "Help" : ""} placement="right">
                    <Button
                        fullWidth
                        startIcon={<HelpOutlineIcon />}
                        sx={{
                            justifyContent: buttonJustify,
                            color: "#D3D5E6",
                            mb: 1,
                            px: {
                                xs: 0,
                                md: collapsed ? 0 : 2
                            },
                            "& .MuiButton-startIcon": {
                                mr: iconMargin
                            }
                        }}
                    >
                        <Box component="span" sx={{ display: labelDisplay }}>
                            Help
                        </Box>
                    </Button>
                </Tooltip>

                <Tooltip title={collapsed ? "Logout" : ""} placement="right">
                    <Button
                        fullWidth
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent: buttonJustify,
                            color: "#D3D5E6",
                            mb: 3,
                            px: {
                                xs: 0,
                                md: collapsed ? 0 : 2
                            },
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
                        px: {
                            xs: 0,
                            md: collapsed ? 0 : 1
                        },
                        justifyContent: buttonJustify
                    }}
                >
                    <MarqAvatar size={40}>
                        {(user?.fullName || user?.name || user?.email || "N")
                            .slice(0, 1)
                            .toUpperCase()}
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
