export type ContributionDay = { date: string; count: number };
export type Contributions = { days: ContributionDay[]; total: number };

const USER = 'prashantchataut';

/**
 * Reads the public contribution calendar from github.com and returns one entry per day.
 * Returns null when the calendar cannot be read, so the hero never shows invented data.
 */
export async function getContributions(): Promise<Contributions | null> {
    try {
        const res = await fetch(`https://github.com/users/${USER}/contributions`, {
            headers: { 'User-Agent': 'knowprashant.vercel.app', Accept: 'text/html' },
            next: { revalidate: 60 * 60 * 6 },
        });
        if (!res.ok) return null;
        const html = await res.text();

        const counts = new Map<string, number>();
        for (const m of Array.from(html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)</g))) {
            const label = m[2].trim();
            const n = /^([\d,]+) contributions?/.exec(label);
            if (n) counts.set(m[1], Number(n[1].replace(/,/g, '')));
            else if (/^No contributions/.test(label)) counts.set(m[1], 0);
        }

        const days: ContributionDay[] = [];
        for (const m of Array.from(html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g))) {
            const tag = m[0];
            const date = /data-date="([\d-]+)"/.exec(tag)?.[1];
            const id = /\bid="([^"]+)"/.exec(tag)?.[1];
            if (!date || !id || !counts.has(id)) continue;
            days.push({ date, count: counts.get(id)! });
        }

        if (days.length < 300 || days.length > 380) return null;
        days.sort((a, b) => a.date.localeCompare(b.date));
        const total = days.reduce((sum, d) => sum + d.count, 0);
        return { days, total };
    } catch {
        return null;
    }
}
