import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/ai/chat-widget";
import { config } from "@/server/config";
import { getRates } from "@/server/lib/fx";
import { CurrencyProvider } from "@/components/currency/currency-provider";
import { SiteMotion } from "@/components/ui/site-motion";

// No cookies are read here, so public pages are rendered once and served from cache.
// The header detects a signed-in visitor in the browser (see ACCOUNT_HINT_COOKIE).
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const fx = await getRates(); // cached for 12h — visitors never trigger an API call

  return (
    <CurrencyProvider rates={fx?.rates ?? null}>
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
      <SiteMotion />
    </CurrencyProvider>
  );
}
