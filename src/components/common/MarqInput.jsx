import { Input } from "antd";

import { mergeClassNames, mergeStyles, sxToStyle } from "./styleUtils";

function extractAdornment(InputProps, slotProps) {
    return (
        InputProps?.startAdornment ||
        slotProps?.input?.startAdornment ||
        slotProps?.input?.prefix ||
        InputProps?.prefix
    );
}

export default function MarqInput({
    InputProps,
    slotProps,
    sx,
    style,
    className,
    label,
    error,
    helperText,
    multiline,
    minRows,
    maxRows,
    type,
    ...props
}) {
    const Component = multiline ? Input.TextArea : Input;
    const prefix = multiline ? undefined : extractAdornment(InputProps, slotProps);
    const status = error ? "error" : undefined;
    const inputType = type === "password" && !multiline ? "password" : type;

    return (
        <label className={mergeClassNames("marq-input", error && "marq-input-error", className)} style={sxToStyle(sx)}>
            {label && <span className="marq-input-label">{label}</span>}
            <Component
                status={status}
                prefix={prefix}
                type={inputType}
                autoSize={multiline ? { minRows: minRows || 2, maxRows: maxRows || 6 } : undefined}
                className="marq-input-control"
                style={mergeStyles(style)}
                {...props}
            />
            {helperText && <span className="marq-input-help">{helperText}</span>}
        </label>
    );
}