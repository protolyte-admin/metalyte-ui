// Display formatters that don't belong in time.js or the chat layer.

export function formatPhoneNumber(value, { fallbackCountryCode = "91" } = {}) {
    if (!value) return "";
    const raw = String(value).replace(/\D/g, "");
    if (!raw) return String(value);
    // If the number is 10 digits, prefix with the fallback country code.
    const withCountry =
        raw.length === 10 ? `${fallbackCountryCode}${raw}` : raw;
    if (withCountry.length <= 5) return withCountry;
    // "+CC XXXXX XXXXX" — last 5 in the second group, first 5 in the first.
    const cc = withCountry.slice(0, withCountry.length - 10);
    const a = withCountry.slice(withCountry.length - 10, withCountry.length - 5);
    const b = withCountry.slice(withCountry.length - 5);
    return cc ? `+${cc} ${a} ${b}` : `${a} ${b}`;
}

export function getInitials(name) {
    if (!name) return "?";
    return name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase();
}
