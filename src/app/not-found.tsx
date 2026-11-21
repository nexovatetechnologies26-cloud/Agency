import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="theme-dark min-h-screen bg-paper text-ink">
      <Header />
      <main id="main" className="relative overflow-hidden">
        <div aria-hidden className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="container relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-[7rem] font-semibold leading-none tracking-[-0.06em] text-ink/10 md:text-[11rem]">404</p>
          <h1 className="-mt-6 font-display text-3xl font-semibold tracking-[-0.03em] md:text-5xl">This page doesn&apos;t exist</h1>
          <p className="mt-5 max-w-md text-body text-muted">The link may be broken, or the page may have moved. Let&apos;s get you back on track.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" size="lg">
              Back to home
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
