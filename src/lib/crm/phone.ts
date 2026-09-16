import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Normalize a raw phone string to E.164 (e.g. "+923431111003"), or null if it
 * isn't a valid number. Default region is Pakistan.
 *
 * The subtlety that bites: a WhatsApp `wa_id` (and most stored numbers) is
 * ALREADY a full international number with no "+" — e.g. Oman "96878783909".
 * libphonenumber, told the default country is PK, happily reports such a string
 * as a *valid Pakistani* number and prepends +92 (→ "+9296878783909"), silently
 * corrupting every non-PK number. So we must decide international-vs-local
 * BEFORE trusting a default-country parse:
 *   - a leading "+" is unambiguously international;
 *   - bare digits with no trunk "0" and 11+ long already carry a country code
 *     (every wa_id does) → parse as international first;
 *   - otherwise it's a local number → parse against the default country.
 */
export function normalizePhone(
  raw: string | null | undefined,
  defaultCountry: "PK" = "PK",
): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;

  // A leading "+" is explicit international format — never apply a default region.
  if (s.startsWith("+")) {
    const parsed = parsePhoneNumberFromString(s);
    return parsed && parsed.isValid() ? parsed.number : null;
  }

  const digits = s.replace(/\D/g, "");

  // Bare digits, no national trunk "0", 11+ long → already includes a country
  // code (WhatsApp wa_ids, stored international numbers). Try international
  // FIRST so a Gulf/foreign number isn't misread as local and given a bogus +92.
  if (!digits.startsWith("0") && digits.length >= 11) {
    const intl = parsePhoneNumberFromString(`+${digits}`);
    if (intl && intl.isValid()) return intl.number;
  }

  // Local number in the default region (e.g. PK "0300…" / "300…").
  const local = parsePhoneNumberFromString(s, defaultCountry);
  if (local && local.isValid()) return local.number;

  // Last resort: bare international digits we couldn't validate as local.
  if (/^\d{10,15}$/.test(digits)) {
    const intl = parsePhoneNumberFromString(`+${digits}`);
    if (intl && intl.isValid()) return intl.number;
  }
  return null;
}
