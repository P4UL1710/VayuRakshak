// Relative illustrative scores; not inhaled dose or clinical risk.
export function exposureReduction(baseline: number, score: number) {
 if (!Number.isFinite(baseline) || !Number.isFinite(score) || baseline <= 0 || score < 0) return 0;
 return Math.max(0, Math.min(100, Math.round((1 - score / baseline) * 100)));
}
