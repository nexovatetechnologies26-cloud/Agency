import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="section">
        <div className="container flex flex-col items-center text-center">
          <p className="eyebrow">404</p>
          <h1 className="mt-4 text-4xl">This page doesn&apos;t exist</h1>
          <p className="mt-4 max-w-md text-muted">The link may be broken or the page may have moved.</p>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/">Back to home</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Contact us</ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
