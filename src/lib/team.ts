export type TeamMember = {
  name: string;
  role: string;
  /** 1–2 line bio. Optional — omitted if empty. */
  bio?: string;
  /** Path under /public, e.g. "/team/ehsan.jpg". Falls back to initials if empty. */
  photo?: string;
};

/** The two co-founders, featured at the top of the About team section. */
export const founders: TeamMember[] = [
  {
    name: "Ehsan Shabbir",
    role: "Co-Founder",
    bio: "",
    photo: "/team/ehsan.png",
  },
  {
    name: "Muhammad Awais",
    role: "Co-Founder",
    bio: "",
    photo: "",
  },
];

/** The wider team, shown in a grid below the founders. Add members here. */
export const team: TeamMember[] = [
  { name: "Umer Shahzad", role: "Digital Marketing Specialist", photo: "/team/umer.png" },
  { name: "Mustafa Ali", role: "Backend Engineer", photo: "/team/mustafa.png" },
  { name: "Muhammad Hassan", role: "Full-Stack Engineer", photo: "/team/hassan.png" },
  { name: "Abdul Haseeb Hameed Sabri", role: "Automation Engineer", photo: "/team/haseeb.png" },
  { name: "Muhammad Habeeb ur Rehman", role: "Sales Executive", photo: "/team/habeeb.png" },
  { name: "Zainab", role: "Accounts & Finance", photo: "/team/zainab.png" },
  { name: "Maira", role: "Video Editor", photo: "/team/maira.png" },
];
