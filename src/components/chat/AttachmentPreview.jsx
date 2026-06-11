import { Box, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

function getAttachmentIcon(type = "", name = "") {
    const value = `${type} ${name}`.toLowerCase();

    if (value.includes("pdf")) {
        return <PictureAsPdfOutlinedIcon />;
    }

    if (value.includes("image") || /\.(png|jpe?g|gif|webp)$/i.test(name)) {
        return <ImageOutlinedIcon />;
    }

    return <DescriptionOutlinedIcon />;
}

export default function AttachmentPreview({ attachment }) {
    const name = attachment.name || attachment.fileName || attachment.url || "Attachment";
    const size = attachment.size || attachment.fileSize;
    const type = attachment.type || attachment.mimeType || "";
    const url = attachment.url || attachment.downloadUrl;
    const isImage = type.toLowerCase().includes("image") || /\.(png|jpe?g|gif|webp)$/i.test(name);

    if (isImage && url) {
        return (
            <Box
                component="img"
                src={url}
                alt={name}
                sx={{
                    mt: 1.5,
                    maxWidth: 320,
                    width: "100%",
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.1)"
                }}
            />
        );
    }

    return (
        <Box
            sx={{
                mt: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                maxWidth: 320,
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)"
            }}
        >
            <Box
                sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: type.toLowerCase().includes("pdf") ? "#B9151C" : "#273854",
                    color: "#F5F7FF"
                }}
            >
                {getAttachmentIcon(type, name)}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    sx={{
                        fontWeight: 800,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                >
                    {name}
                </Typography>
                {size && (
                    <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                        {size}
                    </Typography>
                )}
            </Box>
            <DownloadOutlinedIcon sx={{ color: "#D8D9EA" }} />
        </Box>
    );
}
