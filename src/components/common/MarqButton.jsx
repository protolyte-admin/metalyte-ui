import { Button } from "@mui/material";

export default function MarqButton({ sx, ...props }) {
    return (
        <Button
            sx={{
                borderRadius: 2,
                ...sx
            }}
            {...props}
        />
    );
}
