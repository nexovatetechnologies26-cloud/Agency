import { Codepen, Dribbble, Facebook, Figma, Github, Gitlab, Globe, Instagram, Linkedin, Twitch, Youtube } from "lucide-react";

// Profile links entered in Admin → Team Profiles. Any number of links;
// the platform (name, icon, brand colour) is detected from the URL.

/** Current X (formerly Twitter) mark. */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

type IconCmp = React.ComponentType<{ className?: string; size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
type Platform = { name: string; icon: IconCmp; color: string };

const PLATFORMS: { match: RegExp; platform: Platform }[] = [
  { match: /(^|\.)linkedin\.com$/, platform: { name: "LinkedIn", icon: Linkedin, color: "#0A66C2" } },
  { match: /(^|\.)(x|twitter)\.com$/, platform: { name: "X", icon: XIcon, color: "#000000" } },
  { match: /(^|\.)(facebook|fb)\.com$/, platform: { name: "Facebook", icon: Facebook, color: "#1877F2" } },
  { match: /(^|\.)instagram\.com$/, platform: { name: "Instagram", icon: Instagram, color: "#E4405F" } },
  { match: /(^|\.)(youtube\.com|youtu\.be)$/, platform: { name: "YouTube", icon: Youtube, color: "#FF0000" } },
  { match: /(^|\.)github\.com$/, platform: { name: "GitHub", icon: Github, color: "#181717" } },
  { match: /(^|\.)gitlab\.com$/, platform: { name: "GitLab", icon: Gitlab, color: "#FC6D26" } },
  { match: /(^|\.)dribbble\.com$/, platform: { name: "Dribbble", icon: Dribbble, color: "#EA4C89" } },
  { match: /(^|\.)figma\.com$/, platform: { name: "Figma", icon: Figma, color: "#F24E1E" } },
  { match: /(^|\.)twitch\.tv$/, platform: { name: "Twitch", icon: Twitch, color: "#9146FF" } },
  { match: /(^|\.)codepen\.io$/, platform: { name: "CodePen", icon: Codepen, color: "#000000" } },
  { match: /(^|\.)behance\.net$/, platform: { name: "Behance", icon: Globe, color: "#1769FF" } },
  { match: /(^|\.)tiktok\.com$/, platform: { name: "TikTok", icon: Globe, color: "#000000" } },
  { match: /(^|\.)medium\.com$/, platform: { name: "Medium", icon: Globe, color: "#000000" } },
];

export function detectPlatform(url: string): Platform {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    /* fall through to "Website" */
  }
  const hit = PLATFORMS.find((p) => p.match.test(host));
  return hit?.platform ?? { name: host || "Website", icon: Globe, color: "#7545D9" };
}

export type ProfileLink = { label?: string | null; url: string };

/** Round brand-coloured badge with the platform's mark. */
export function PlatformBadge({ url, size = 40 }: { url: string; size?: number }) {
  const p = detectPlatform(url);
  const Icon = p.icon;
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full text-white" style={{ width: size, height: size, backgroundColor: p.color }}>
      <Icon className="h-[18px] w-[18px]" size={18} strokeWidth={2} aria-hidden />
    </span>
  );
}

export function linkLabel(link: ProfileLink) {
  return link.label?.trim() || detectPlatform(link.url).name;
}
