import { Bot, Clapperboard, Code2, Cpu, LayoutTemplate, Palette, Search, Share2, ShoppingCart, Smartphone } from "lucide-react";
import type { ServiceIcon as IconName } from "@/content/services";

const map = {
  code: Code2,
  wordpress: LayoutTemplate,
  cart: ShoppingCart,
  smartphone: Smartphone,
  cpu: Cpu,
  search: Search,
  share: Share2,
  palette: Palette,
  bot: Bot,
  video: Clapperboard,
} satisfies Record<IconName, unknown>;

export function ServiceIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = map[name];
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}
