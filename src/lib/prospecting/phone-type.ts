import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

/**
 * Classify a prospect's phone number as mobile / landline / unknown from its
 * numbering range ("/max" metadata carries per-range type data). Drives the
 * Mobile vs Landline filters — a landline can never be on WhatsApp, so this is
 * the cheapest "will a template even deliver?" signal we have.
 */
export type PhoneType = "mobile" | "landline" | "unknown";

const MOBILE_TYPES = new Set(["MOBILE", "PERSONAL_NUMBER"]);
const LANDLINE_TYPES = new Set([
  "FIXED_LINE",
  "UAN", // company access numbers (e.g. Pakistan's 111-… lines)
  "TOLL_FREE",
  "PREMIUM_RATE",
  "SHARED_COST",
  "PAGER",
  "VOICEMAIL",
]);

export function classifyPhone(phone: string | null, countryCode?: string): PhoneType | null {
  if (!phone?.trim()) return null;
  const parsed = parsePhoneNumberFromString(phone, countryCode as CountryCode | undefined);
  const type = parsed?.getType();
  if (type && MOBILE_TYPES.has(type)) return "mobile";
  if (type && LANDLINE_TYPES.has(type)) return "landline";
  // FIXED_LINE_OR_MOBILE (ranges some countries don't split), VOIP, unparsable.
  return "unknown";
}
