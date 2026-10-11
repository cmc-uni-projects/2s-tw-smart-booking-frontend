// src/utils/serverTime.js
// The backend sends LocalDateTime values without a zone ("2026-10-11T09:35:55.69"); they are Vietnam time.
// new Date() would read them in the browser's own zone, so add the offset explicitly.
const SERVER_OFFSET = "+07:00";

/** Milliseconds since epoch for a server timestamp; NaN if missing/invalid. */
export const parseServerTime = (value) => {
  if (!value) return NaN;
  if (typeof value !== "string") return new Date(value).getTime();
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(value);
  // trim microseconds (JS keeps milliseconds only)
  const normalised = value.replace(/(\.\d{3})\d+/, "$1");
  return new Date(hasZone ? normalised : normalised + SERVER_OFFSET).getTime();
};
