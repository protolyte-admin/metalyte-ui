import { Card } from "antd";

import { mergeClassNames, mergeStyles, sxToStyle } from "./styleUtils";

export default function MarqCard({ sx, style, className, children, ...props }) {
    return (
        <Card
            bordered
            className={mergeClassNames("marq-card", className)}
            style={mergeStyles(sxToStyle(sx), style)}
            {...props}
        >
            {children}
        </Card>
    );
}