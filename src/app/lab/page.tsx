import type { Metadata } from "next";
import { LabEntry } from "./lab-entry";

export const metadata: Metadata = {
  title: "Summit Lab — Scene Preview",
  robots: { index: false, follow: false },
};

export default function Lab() {
  return <LabEntry />;
}
