import { TextField } from "@mui/material";

export default function MarqInput({ InputProps, slotProps, sx, ...props }) {
    return (
        <TextField
            fullWidth
            slotProps={{
                ...slotProps,
                input: {
                    ...(slotProps?.input || {}),
                    ...(InputProps || {})
                }
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    minHeight: 58
                },
                ...sx
            }}
            {...props}
        />
    );
}
