import { useState } from "react";
import {
    Box,
    InputAdornment,
    Typography
} from "@mui/material";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import SendIcon from "@mui/icons-material/Send";

import MarqButton from "../common/MarqButton";
import MarqInput from "../common/MarqInput";
import MarqModal from "../common/MarqModal";

function validate({ phoneNumber, body }) {
    const errors = {};
    if (!phoneNumber?.trim()) {
        errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?\d{8,15}$/.test(phoneNumber.replace(/\s/g, ""))) {
        errors.phoneNumber = "Phone number must be 8–15 digits, optional + prefix";
    }
    if (!body?.trim()) {
        errors.body = "Message is required";
    } else if (body.length > 4096) {
        errors.body = "Message is too long (max 4096 characters)";
    }
    return errors;
}

const EMPTY = { phoneNumber: "", body: "" };

export default function NewMessageModal({ open, onClose, onSend }) {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const update = (field) => (event) => {
        const next = { ...values, [field]: event.target.value };
        setValues(next);
        if (errors[field]) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[field];
                return copy;
            });
        }
    };

    const handleClose = () => {
        if (submitting) return;
        setValues(EMPTY);
        setErrors({});
        setServerError("");
        onClose();
    };

    const handleSubmit = async (event) => {
        event?.preventDefault?.();
        const nextErrors = validate(values);
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        try {
            setSubmitting(true);
            setServerError("");
            const payload = {
                to: values.phoneNumber.replace(/\s/g, ""),
                body: values.body.trim()
            };
            await onSend(payload);
            setValues(EMPTY);
            setErrors({});
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.data?.message ||
                err?.message ||
                "Failed to send message";
            setServerError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MarqModal
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: "#0A1A33",
                    backgroundImage:
                        "linear-gradient(145deg, rgba(22,35,61,0.96), rgba(14,25,46,0.98))"
                }
            }}
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                    New message
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 3, fontSize: 14 }}>
                    Send a WhatsApp message to any number in your organization’s
                    reach. The conversation will appear in your inbox once the
                    recipient responds.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <MarqInput
                        label="Phone number"
                        value={values.phoneNumber}
                        onChange={update("phoneNumber")}
                        error={Boolean(errors.phoneNumber)}
                        helperText={
                            errors.phoneNumber ||
                            "Include country code, e.g. 919876543210"
                        }
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocalPhoneOutlinedIcon sx={{ color: "#C7C9DF" }} />
                                </InputAdornment>
                            )
                        }}
                    />

                    <MarqInput
                        label="Message"
                        value={values.body}
                        onChange={update("body")}
                        error={Boolean(errors.body)}
                        helperText={errors.body}
                        multiline
                        minRows={4}
                        maxRows={10}
                    />

                    {serverError && (
                        <Typography
                            sx={{
                                color: "#FF8A8A",
                                fontSize: 13,
                                fontWeight: 700,
                                bgcolor: "rgba(255,138,138,0.08)",
                                px: 1.5,
                                py: 1,
                                borderRadius: 1
                            }}
                        >
                            {serverError}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1.5,
                        justifyContent: "flex-end",
                        mt: 4
                    }}
                >
                    <MarqButton
                        onClick={handleClose}
                        disabled={submitting}
                        sx={{
                            color: "text.secondary",
                            px: 3,
                            minHeight: 48
                        }}
                    >
                        Cancel
                    </MarqButton>
                    <MarqButton
                        type="submit"
                        variant="contained"
                        startIcon={<SendIcon />}
                        disabled={submitting}
                        sx={{
                            bgcolor: "#B9AEFF",
                            color: "#020B1F",
                            fontWeight: 800,
                            px: 3,
                            minHeight: 48,
                            letterSpacing: 0.4,
                            "&:hover": { bgcolor: "#C9C2FF" },
                            "&.Mui-disabled": {
                                bgcolor: "rgba(185,174,255,0.35)",
                                color: "rgba(2,11,31,0.55)"
                            }
                        }}
                    >
                        {submitting ? "Sending…" : "Send"}
                    </MarqButton>
                </Box>
            </Box>
        </MarqModal>
    );
}
