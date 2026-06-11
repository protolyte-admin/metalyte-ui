// Single source of truth for timestamp formatting in this app.
// Backend emits ISO-8601 UTC strings (e.g. "2026-06-10T09:00:23.721Z").
// We display everything in IST (Asia/Kolkata, UTC+05:30).

const IST_TIME_ZONE = "Asia/Kolkata";

const TIME_FORMATTER = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: IST_TIME_ZONE
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: IST_TIME_ZONE
});

const DAY_FORMATTER = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: IST_TIME_ZONE
});

// Returns a Date or null. Accepts ISO strings, epoch numbers, and Date objects.
export function parseTimestamp(value) {
    if (value == null) return null;
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }
    if (typeof value === "number") {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

// Short time, e.g. "2:35 PM" — used in message bubbles and the conversation list.
export function formatTimeIST(value) {
    const d = parseTimestamp(value);
    if (!d) return "";
    return TIME_FORMATTER.format(d);
}

// Long date + time, e.g. "10 Jun 2026, 2:35 PM".
export function formatDateTimeIST(value) {
    const d = parseTimestamp(value);
    if (!d) return "";
    return DATE_TIME_FORMATTER.format(d);
}

// Day label, e.g. "Wed, 10 Jun". Used for date separators in the chat.
export function formatDayIST(value) {
    const d = parseTimestamp(value);
    if (!d) return "";
    return DAY_FORMATTER.format(d);
}

// True if both values fall on the same calendar day in IST.
export function isSameDayIST(a, b) {
    const da = parseTimestamp(a);
    const db = parseTimestamp(b);
    if (!da || !db) return false;
    const fmt = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: IST_TIME_ZONE
    });
    return fmt.format(da) === fmt.format(db);
}

// Conversation-list timestamps: "now", "5m", "2h", "Yesterday", "10 Jun".
export function formatRelativeShortIST(value, now = new Date()) {
    const d = parseTimestamp(value);
    if (!d) return "";
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 1) return "now";
    if (diffMin < 60) return `${diffMin}m`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h`;
    const diffDay = Math.round(diffHr / 24);
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) {
        return new Intl.DateTimeFormat("en-IN", {
            weekday: "short",
            timeZone: IST_TIME_ZONE
        }).format(d);
    }
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        timeZone: IST_TIME_ZONE
    }).format(d);
}
