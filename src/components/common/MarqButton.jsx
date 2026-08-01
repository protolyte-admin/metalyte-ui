import { Button } from "antd";

import { mergeClassNames, mergeStyles, sxToStyle } from "./styleUtils";

export default function MarqButton({
    variant,
    type,
    htmlType,
    fullWidth,
    startIcon,
    sx,
    style,
    className,
    ...props
}) {
    const visualType = variant === "contained" || variant === "primary" ? "primary" : "default";
    const resolvedHtmlType = htmlType || (type === "submit" || type === "reset" || type === "button" ? type : undefined);

    return (
        <Button
            type={visualType}
            htmlType={resolvedHtmlType}
            block={fullWidth}
            icon={startIcon}
            className={mergeClassNames("marq-button", className)}
            style={mergeStyles(sxToStyle(sx), style)}
            {...props}
        />
    );
}