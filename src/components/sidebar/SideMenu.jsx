import {
    Box,
    IconButton,
    Tooltip
} from "@mui/material";

import ChatIcon
    from "@mui/icons-material/Chat";

import CampaignIcon
    from "@mui/icons-material/Campaign";

import DescriptionIcon
    from "@mui/icons-material/Description";

import AnalyticsIcon
    from "@mui/icons-material/Analytics";

import SettingsIcon
    from "@mui/icons-material/Settings";

import LogoutIcon
    from "@mui/icons-material/Logout";

import {
    useAuth
} from "../../context/useAuth";

function SideMenu() {

    const { logout } =
        useAuth();

    return (

        <Box
            sx={{
                width: 70,
                background: "#202c33",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
                gap: 2
            }}
        >

            <Tooltip title="Chats">
                <IconButton>
                    <ChatIcon sx={{ color: "white" }} />
                </IconButton>
            </Tooltip>

            <Tooltip title="Campaigns">
                <IconButton>
                    <CampaignIcon sx={{ color: "white" }} />
                </IconButton>
            </Tooltip>

            <Tooltip title="Templates">
                <IconButton>
                    <DescriptionIcon sx={{ color: "white" }} />
                </IconButton>
            </Tooltip>

            <Tooltip title="Reports">
                <IconButton>
                    <AnalyticsIcon sx={{ color: "white" }} />
                </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
                <IconButton>
                    <SettingsIcon sx={{ color: "white" }} />
                </IconButton>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            <Tooltip title="Logout">
                <IconButton onClick={logout}>
                    <LogoutIcon sx={{ color: "white" }} />
                </IconButton>
            </Tooltip>

        </Box>

    );
}

export default SideMenu;
