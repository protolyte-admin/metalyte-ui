import { tokens } from "../../theme/tokens";

const colorMap = {
    "text.primary": tokens.colors.textPrimary,
    "text.secondary": tokens.colors.textSecondary,
    "text.disabled": tokens.colors.textMuted,
    "primary.main": tokens.colors.primary,
    "success.main": tokens.colors.success,
    "warning.main": tokens.colors.warning,
    "error.main": tokens.colors.danger,
    "background.default": tokens.colors.bgPrimary,
    "background.paper": tokens.colors.bgCard
};

const spacingKeys = new Set([
    "gap",
    "rowGap",
    "columnGap",
    "p",
    "px",
    "py",
    "pt",
    "pr",
    "pb",
    "pl",
    "m",
    "mx",
    "my",
    "mt",
    "mr",
    "mb",
    "ml"
]);

const aliasMap = {
    bgcolor: "backgroundColor",
    p: "padding",
    px: ["paddingLeft", "paddingRight"],
    py: ["paddingTop", "paddingBottom"],
    pt: "paddingTop",
    pr: "paddingRight",
    pb: "paddingBottom",
    pl: "paddingLeft",
    m: "margin",
    mx: ["marginLeft", "marginRight"],
    my: ["marginTop", "marginBottom"],
    mt: "marginTop",
    mr: "marginRight",
    mb: "marginBottom",
    ml: "marginLeft"
};

function resolveResponsive(value) {
    if (!value || Array.isArray(value) || typeof value !== "object") return value;
    if ("xl" in value) return value.xl;
    if ("lg" in value) return value.lg;
    if ("md" in value) return value.md;
    if ("sm" in value) return value.sm;
    if ("xs" in value) return value.xs;
    return undefined;
}

function resolveValue(key, value) {
    const next = resolveResponsive(value);
    if (next == null) return undefined;
    if (typeof next === "string") return colorMap[next] || next;
    if (typeof next === "number" && spacingKeys.has(key)) return next * 8;
    return next;
}

function assignStyle(style, key, value) {
    const cssKey = aliasMap[key] || key;
    if (Array.isArray(cssKey)) {
        cssKey.forEach((entry) => {
            style[entry] = value;
        });
        return;
    }
    style[cssKey] = value;
}

export function sxToStyle(sx) {
    if (!sx || Array.isArray(sx) || typeof sx !== "object") return {};

    return Object.entries(sx).reduce((style, [key, value]) => {
        if (key.startsWith("&") || key.startsWith(".") || key.startsWith("@")) return style;
        const resolved = resolveValue(key, value);
        if (resolved !== undefined) assignStyle(style, key, resolved);
        return style;
    }, {});
}

export function mergeStyles(...styles) {
    return Object.assign({}, ...styles.filter(Boolean));
}

export function mergeClassNames(...names) {
    return names.filter(Boolean).join(" ");
}