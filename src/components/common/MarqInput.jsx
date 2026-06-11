import { TextField } from "@mui/material";

export default function MarqInput({ InputProps, sx, ...props }) {
    return (
        <TextField
            fullWidth
            InputProps={InputProps}
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
