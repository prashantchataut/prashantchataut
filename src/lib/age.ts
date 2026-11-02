/** Asia/Kathmandu is UTC+05:45 and has not observed DST since 1986, so a fixed
 *  offset is exact and no tz database is needed. */
const KATHMANDU_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;

/** 27 May 2009, 22:30 in Kathmandu. */
export const BIRTH_INSTANT = Date.UTC(2009, 4, 27, 16, 45, 0);

export type Age = {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    hh: string;
    mm: string;
    ss: string;
};

/** A Kathmandu wall-clock moment expressed as a UTC instant. */
function kathmanduInstant(y: number, mo: number, d: number, h = 0, mi = 0, s = 0) {
    return Date.UTC(y, mo, d, h, mi, s) - KATHMANDU_OFFSET_MS;
}

/** Read the Kathmandu wall clock off any instant. */
function wallClock(now: number) {
    const n = new Date(now + KATHMANDU_OFFSET_MS);
    return { y: n.getUTCFullYear(), mo: n.getUTCMonth(), d: n.getUTCDate() };
}

export function computeAge(now: number): Age {
    const b = new Date(BIRTH_INSTANT + KATHMANDU_OFFSET_MS);
    const by = b.getUTCFullYear();
    const bm = b.getUTCMonth();
    const bd = b.getUTCDate();

    const { y: ny, mo: nm, d: nd } = wallClock(now);

    let months = (ny - by) * 12 + (nm - bm);
    if (nd < bd) months -= 1;

    const years = Math.floor(months / 12);
    months -= years * 12;

    const anchor = kathmanduInstant(by + years, bm + months, bd, 22, 30);
    const since = Math.max(0, now - anchor);
    const days = Math.floor(since / 86400000);
    const totalSec = Math.floor((since - days * 86400000) / 1000);

    const pad = (v: number) => String(v).padStart(2, '0');

    return {
        years,
        months,
        days,
        totalDays: Math.floor((now - BIRTH_INSTANT) / 86400000),
        hh: pad(Math.floor(totalSec / 3600)),
        mm: pad(Math.floor((totalSec % 3600) / 60)),
        ss: pad(totalSec % 60),
    };
}

export function yearProgress(now: number) {
    const { y } = wallClock(now);
    const shifted = now + KATHMANDU_OFFSET_MS;
    const start = Date.UTC(y, 0, 1);
    const end = Date.UTC(y + 1, 0, 1);
    const spanDays = (end - start) / 86400000;
    const dayOfYear = Math.floor((shifted - start) / 86400000) + 1;

    return {
        pct: Math.min(1, Math.max(0, (shifted - start) / (end - start))),
        year: y,
        daysLeft: Math.max(0, spanDays - dayOfYear),
    };
}