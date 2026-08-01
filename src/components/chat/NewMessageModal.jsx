import { useState } from "react";
import { Alert, Space, Typography } from "antd";
import { PhoneOutlined, SendOutlined } from "@ant-design/icons";

import MarqButton from "../common/MarqButton";
import MarqInput from "../common/MarqInput";
import MarqModal from "../common/MarqModal";

function validate({ phoneNumber, body }) {
    const errors = {};
    if (!phoneNumber?.trim()) errors.phoneNumber = "Phone number is required";
    else if (!/^\+?\d{8,15}$/.test(phoneNumber.replace(/\s/g, ""))) errors.phoneNumber = "Phone number must be 8-15 digits, optional + prefix";
    if (!body?.trim()) errors.body = "Message is required";
    else if (body.length > 4096) errors.body = "Message is too long (max 4096 characters)";
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
            await onSend({ to: values.phoneNumber.replace(/\s/g, ""), body: values.body.trim() });
            setValues(EMPTY);
            setErrors({});
        } catch (err) {
            setServerError(err?.response?.data?.message || err?.response?.data?.data?.message || err?.message || "Failed to send message");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MarqModal open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit} className="new-message-form">
                <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>New message</Typography.Title>
                <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
                    Send a WhatsApp message to any number in your organization's reach. The conversation will appear in your inbox once the recipient responds.
                </Typography.Paragraph>

                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    <MarqInput
                        label="Phone number"
                        value={values.phoneNumber}
                        onChange={update("phoneNumber")}
                        error={Boolean(errors.phoneNumber)}
                        helperText={errors.phoneNumber || "Include country code, e.g. 919876543210"}
                        autoFocus
                        prefix={<PhoneOutlined />}
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
                    {serverError ? <Alert type="error" showIcon message={serverError} /> : null}
                </Space>

                <div className="new-message-actions">
                    <MarqButton onClick={handleClose} disabled={submitting}>Cancel</MarqButton>
                    <MarqButton type="submit" variant="contained" icon={<SendOutlined />} disabled={submitting} loading={submitting}>Send</MarqButton>
                </div>
            </form>
        </MarqModal>
    );
}