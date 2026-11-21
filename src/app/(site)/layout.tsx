import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/ai/chat-widget";
import { config } from "@/server/config";

// No cookies are read here, so public pages are rendered once and served from cache.
// The header detects a signed-in visitor in the browser (see ACCOUNT_HINT_COOKIE).
export default function SiteLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      {config.ai.enabled && <ChatWidget />}
    </>
  );
}
