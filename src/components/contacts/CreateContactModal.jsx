import { useState } from "react";
import { Alert, Space, Typography } from "antd";
import { MailOutlined, PhoneOutlined, UserAddOutlined, FileTextOutlined } from "@ant-design/icons";

import MarqButton from "../common/MarqButton";
import MarqInput from "../common/MarqInput";
import MarqModal from "../common/MarqModal";

function validate(values) {
    const errors = {};
    if (!values.name?.trim()) errors.name = "Name is required";
    if (!values.phoneNumber?.trim()) {
        errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?\d{8,15}$/.test(values.phoneNumber.replace(/\s/g, ""))) {
        errors.phoneNumber = "Phone number must be 8-15 digits, optional + prefix";
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
            await onCreate({
                name: values.name.trim(),
                phoneNumber: values.phoneNumber.replace(/\s/g, ""),
                email: values.email.trim(),
                notes: values.notes.trim()
            });
            setValues(EMPTY);
            setErrors({});
        } catch (err) {
            setServerError(
                err?.response?.data?.message ||
                err?.response?.data?.data?.message ||
                err?.message ||
                "Failed to create contact"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MarqModal open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit} className="contact-modal-form">
                <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
                    New contact
                </Typography.Title>
                <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
                    Contacts are scoped to your organization. You can start a conversation from the contact row once it's saved.
                </Typography.Paragraph>

                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    <MarqInput
                        label="Name"
                        value={values.name}
                        onChange={update("name")}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        autoFocus
                        prefix={<UserAddOutlined />}
                    />
                    <MarqInput
                        label="Phone number"
                        value={values.phoneNumber}
                        onChange={update("phoneNumber")}
                        error={Boolean(errors.phoneNumber)}
                        helperText={errors.phoneNumber || "Include country code, e.g. 919876543210"}
                        prefix={<PhoneOutlined />}
                    />
                    <MarqInput
                        label="Email (optional)"
                        value={values.email}
                        onChange={update("email")}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        prefix={<MailOutlined />}
                    />
                    <MarqInput
                        label="Notes (optional)"
                        value={values.notes}
                        onChange={update("notes")}
                        multiline
                        minRows={2}
                        maxRows={5}
                        prefix={<FileTextOutlined />}
                    />

                    {serverError && <Alert type="error" showIcon message={serverError} />}
                </Space>

                <div className="contact-modal-actions">
                    <MarqButton onClick={handleClose} disabled={submitting}>
                        Cancel
                    </MarqButton>
                    <MarqButton type="submit" variant="contained" disabled={submitting} loading={submitting}>
                        Save contact
                    </MarqButton>
                </div>
            </form>
        </MarqModal>
    );
}