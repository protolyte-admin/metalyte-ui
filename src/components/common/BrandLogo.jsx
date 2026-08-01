import metalyteLogo from "../../assets/metalyte-logo.png";

import { sxToStyle } from "./styleUtils";

export default function BrandLogo({ compact = false, sx, imageSx, style, className }) {
    return (
        <img
            src={metalyteLogo}
            alt="Metalyte"
            className={className}
            style={{
                display: "block",
                width: compact ? 56 : 220,
                height: "auto",
                objectFit: "contain",
                ...sxToStyle(sx),
                ...sxToStyle(imageSx),
                ...style
            }}
        />
    );
}