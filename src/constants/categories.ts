export const DEFAULT_CATEGORIES = [
  "Children",
  "Family Portrait",
  "Abstract",
  "Portrait"
] as const;

export type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number];
