export type AppRole = "user" | "admin";

export const roleTheme = {
  user: {
    shell: "page-shell-user",
    eyebrow: "section-eyebrow-brand",
    inputFocus: "input-brand",
    btnPrimary: "btn-primary-brand",
    badge: "bg-brand-50 border-brand-200 text-brand-800",
    badgeIcon: "text-brand-600",
    badgeLabel: "text-brand-500",
    segmentedActive: "text-brand-700",
    iconBg: "bg-brand-50",
    iconColor: "text-brand-600",
    gradient: "from-brand-600 to-brand-800",
    headerBadge: "bg-brand-50 border-brand-200",
    mobileLabel: "text-brand-600",
  },
  admin: {
    shell: "page-shell-admin",
    eyebrow: "section-eyebrow-accent",
    inputFocus: "input-accent",
    btnPrimary: "btn-primary-accent",
    badge: "bg-accent-50 border-accent-200 text-accent-800",
    badgeIcon: "text-accent-600",
    badgeLabel: "text-accent-500",
    segmentedActive: "text-accent-700",
    iconBg: "bg-accent-50",
    iconColor: "text-accent-600",
    gradient: "from-accent-600 to-accent-800",
    headerBadge: "bg-accent-50 border-accent-200",
    mobileLabel: "text-accent-600",
  },
} as const;
