import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/ai/chat-widget";
import { getSession } from "@/server/auth/session";
import { config } from "@/server/config";
import { isStaff } from "@/lib/permissions";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const account = session ? { name: session.name, href: isStaff(session.role) ? "/admin" : "/dashboard" } : null;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header account={account} />
      <main id="main">{children}</main>
      <Footer />
      {config.ai.enabled && <ChatWidget />}
    </>
  );
}
