import { redirect } from "next/navigation";
import { googleReviewUrl } from "@/lib/site-content";

/**
 * Zero-friction review link: /review goes STRAIGHT to Google's write-a-review
 * dialog for the Summit Systems profile. No interstitial page — the link you
 * share (WhatsApp, QR, email signature) is one tap from the star picker.
 */
export const dynamic = "force-dynamic";

export default function ReviewPage() {
  redirect(googleReviewUrl);
}
