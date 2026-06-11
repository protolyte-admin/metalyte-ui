import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/PlaylistAddCircleRounded";
import CodeIcon from "@mui/icons-material/Code";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

const editorTools = [
    { label: "Bold", icon: <FormatBoldIcon /> },
    { label: "Italic", icon: <FormatItalicIcon /> },
    { label: "List", icon: <FormatListBulletedIcon /> },
    { label: "Code", icon: <CodeIcon /> }
];

export default function ChatInput({ disabled = false, onSend }) {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async () => {
        const trimmed = message.trim();
        if (!trimmed || !onSend) {
            return;
        }

        try {
            setSending(true);
            // Clear input optimistically; parent owns message state of record
            setMessage("");
            await onSend(trimmed);
        } catch (error) {
            // Restore text on failure so the user does not lose it
            setMessage(trimmed);
            console.error("ChatInput: send failed", error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (event) => {
        // Ctrl+Enter or Cmd+Enter sends
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Box
            sx={{
                p: {
                    xs: 2,
                    md: 3
                },
                borderTop: "1px solid rgba(255,255,255,0.08)",
                background: "#020B1F",
                flex: "0 0 auto"
            }}
        >
            <Box
                sx={{
                    background: "#1B2A44",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2,
                    p: 1.25
                }}
            >
                <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                    {editorTools.map((tool) => (
                        <Tooltip key={tool.label} title={tool.label}>
                            <span>
                                <IconButton size="small" disabled={disabled}>
                                    {tool.icon}
                                </IconButton>
                            </span>
                        </Tooltip>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    <Tooltip title="Attach file">
                        <span>
                            <IconButton disabled={disabled}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <TextField
                        multiline
                        maxRows={4}
                        fullWidth
                        variant="standard"
                        placeholder="Type your message..."
                        value={message}
                        disabled={disabled || sending}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            disableUnderline: true
                        }}
                        sx={{
                            "& .MuiInputBase-root": {
                                color: "text.primary",
                                fontSize: 17
                            }
                        }}
                    />

                    <Tooltip title="Emoji">
                        <span>
                            <IconButton disabled={disabled}>
                                <EmojiEmotionsOutlinedIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Send">
                        <span>
                            <IconButton
                                disabled={disabled || sending || !message.trim()}
                                onClick={handleSubmit}
                                sx={{
                                    bgcolor: "#B9AEFF",
                                    color: "#020B1F",
                                    width: 50,
                                    height: 50,
                                    borderRadius: 2,
                                    "&:hover": {
                                        bgcolor: "#C9C2FF"
                                    },
                                    "&.Mui-disabled": {
                                        bgcolor: "rgba(185,174,255,0.35)",
                                        color: "rgba(2,11,31,0.45)"
                                    }
                                }}
                            >
                                <SendIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            </Box>

            <Box
                sx={{
                    mt: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    color: "text.secondary",
                    fontSize: 12
                }}
            >
                <Typography variant="caption">
                    <Box
                        component="span"
                        sx={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#B9AEFF",
                            mr: 1
                        }}
                    />
                    Auto-save active
                </Typography>
                <Typography variant="caption" sx={{ display: { xs: "none", sm: "block" } }}>
                    Press Ctrl + Enter to send
                </Typography>
            </Box>
        </Box>
    );
}
