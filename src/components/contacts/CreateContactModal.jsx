import { useState } from "react";
import {
    Box,
    InputAdornment,
    Typography
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonAddAlt";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";

import MarqButton from "../common/MarqButton";
import MarqInput from "../common/MarqInput";
import MarqModal from "../common/MarqModal";

// Lightweight, in-modal form validation. The backend still does the
// authoritative check; this is purely to give the user immediate feedback.
function validate(values) {
    const errors = {};
    if (!values.name?.trim()) {
        errors.name = "Name is required";
    }
    if (!values.phoneNumber?.trim()) {
        errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?\d{8,15}$/.test(values.phoneNumber.replace(/\s/g, ""))) {
        errors.phoneNumber = "Phone number must be 8–15 digits, optional + prefix";
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Invalid email address";
    }
    return errors;
}

const EMPTY = { name: "", phoneNumber: "", email: "", notes: "" };

export default function CreateContactModal({ open, onClose, onCreate }) {
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
                name: values.name.trim(),
                phoneNumber: values.phoneNumber.replace(/\s/g, ""),
                email: values.email.trim(),
                notes: values.notes.trim()
            };
            await onCreate(payload);
            setValues(EMPTY);
            setErrors({});
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.data?.message ||
                err?.message ||
                "Failed to create contact";
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
                    New contact
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 3, fontSize: 14 }}>
                    Contacts are scoped to your organization. You can start a
                    conversation from the contact row once it's saved.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <MarqInput
                        label="Name"
                        value={values.name}
                        onChange={update("name")}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon sx={{ color: "#C7C9DF" }} />
                                </InputAdornment>
                            )
                        }}
                    />

                    <MarqInput
                        label="Phone number"
                        value={values.phoneNumber}
                        onChange={update("phoneNumber")}
                        error={Boolean(errors.phoneNumber)}
                        helperText={errors.phoneNumber || "Include country code, e.g. 919876543210"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocalPhoneOutlinedIcon sx={{ color: "#C7C9DF" }} />
                                </InputAdornment>
                            )
                        }}
                    />

                    <MarqInput
                        label="Email (optional)"
                        value={values.email}
                        onChange={update("email")}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon sx={{ color: "#C7C9DF" }} />
                                </InputAdornment>
                            )
                        }}
                    />

                    <MarqInput
                        label="Notes (optional)"
                        value={values.notes}
                        onChange={update("notes")}
                        multiline
                        minRows={2}
                        maxRows={5}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ alignItems: "flex-start", mt: 1.2 }}>
                                    <StickyNote2OutlinedIcon sx={{ color: "#C7C9DF" }} />
                                </InputAdornment>
                            )
                        }}
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
                        {submitting ? "Saving…" : "Save contact"}
                    </MarqButton>
                </Box>
            </Box>
        </MarqModal>
    );
}
