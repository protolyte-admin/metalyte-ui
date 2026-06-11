import { Dialog } from "@mui/material";

export default function MarqModal({ PaperProps, ...props }) {
    return (
        <Dialog
            PaperProps={{
                ...PaperProps,
                sx: {
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.08)",
                    ...(PaperProps?.sx || {})
                }
            }}
            {...props}
        />
    );
}
