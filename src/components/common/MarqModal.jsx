import { Modal } from "antd";

import { mergeClassNames, sxToStyle } from "./styleUtils";

const widthMap = {
    xs: 360,
    sm: 560,
    md: 720,
    lg: 960,
    xl: 1160
};

export default function MarqModal({
    PaperProps,
    onClose,
    onCancel,
    maxWidth = "sm",
    fullWidth,
    children,
    className,
    footer = null,
    closable = true,
    ...props
}) {
    return (
        <Modal
            footer={footer}
            closable={closable}
            onCancel={onCancel || onClose}
            width={fullWidth ? widthMap[maxWidth] || maxWidth : undefined}
            className={mergeClassNames("marq-modal", className)}
            styles={{
                content: sxToStyle(PaperProps?.sx),
                body: { padding: 0 }
            }}
            {...props}
        >
            {children}
        </Modal>
    );
}