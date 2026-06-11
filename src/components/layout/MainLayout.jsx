import { Box } from "@mui/material";
import SideMenu from "../sidebar/SideMenu";

function MainLayout({ children }) {

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                background: "#111b21"
            }}
        >
            <SideMenu />
            {children}
        </Box>
    );
}

export default MainLayout;