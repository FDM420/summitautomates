import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Normalize a raw phone string to E.164 (e.g. "+923431111003"), or null if it
 * isn't a valid number. Default region is Pakistan; WhatsApp `from` values are
 * already full international numbers (digits, no "+"), which we handle too.
 */
export function normalizePhone(
  raw: string | null | undefined,
  defaultCountry: "PK" = "PK",
): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;

  let parsed = parsePhoneNumberFromString(s, defaultCountry);
  if ((!parsed || !parsed.isValid()) && /^\d{10,15}$/.test(s)) {
    // Bare international digits (WhatsApp style) — try with a leading "+".
    parsed = parsePhoneNumberFromString(`+${s}`);
  }
  return parsed && parsed.isValid() ? parsed.number : null;
}
