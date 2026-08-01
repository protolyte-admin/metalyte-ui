import { Avatar, Badge } from "antd";

import { tokens } from "../../theme/tokens";
import { mergeClassNames, sxToStyle } from "./styleUtils";

export default function MarqAvatar({
    online = false,
    size = 44,
    sx,
    style,
    className,
    children,
    ...props
}) {
    const avatar = (
        <Avatar
            size={size}
            className={mergeClassNames("marq-avatar", className)}
            style={{
                backgroundColor: tokens.colors.bgSecondary,
                color: tokens.colors.textPrimary,
                border: "1px solid rgba(123,109,255,0.34)",
                fontWeight: 700,
                flex: "0 0 auto",
                ...sxToStyle(sx),
                ...style
            }}
            {...props}
        >
            {children}
        </Avatar>
    );

    if (!online) return avatar;

    return (
        <Badge
            dot
            color={tokens.colors.success}
            offset={[-Math.max(3, size * 0.08), Math.max(4, size * 0.08)]}
            className="marq-avatar-status"
        >
            {avatar}
        </Badge>
    );
}