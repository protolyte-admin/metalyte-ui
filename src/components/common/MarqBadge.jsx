import { Badge } from "antd";

import { mergeClassNames, sxToStyle } from "./styleUtils";

export default function MarqBadge({ children, sx, style, className }) {
    return (
        <Badge
            count={children}
            className={mergeClassNames("marq-badge", className)}
            style={{ ...sxToStyle(sx), ...style }}
        />
    );
}