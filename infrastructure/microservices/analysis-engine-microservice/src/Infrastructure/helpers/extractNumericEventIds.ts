export function extractNumericEventIds(events: unknown): Set<number> {
    const ids = new Set<number>();

    if (Array.isArray(events)) {
        for (const e of events) {
            if (e && typeof e === "object" && "id" in e) {
                const v = (e as any).id;
                if (typeof v === "number" && Number.isFinite(v)) {
                    ids.add(v);
                }
            }
        }
    }

    return ids;
}
