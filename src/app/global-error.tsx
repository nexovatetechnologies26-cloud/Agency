"use client";

// Last-resort boundary for errors in the root layout itself. It replaces the
// whole document, so it can't rely on the app's fonts or stylesheet.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif", background: "#F7F6FA", color: "#17151F" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <div style={{ maxWidth: 420 }}>
            <p style={{ fontSize: 22, fontWeight: 800, margin: "0 0 24px" }}>
              Ne<span style={{ color: "#7545D9" }}>x</span>ovate
            </p>
            <h1 style={{ fontSize: 26, margin: "0 0 12px" }}>Something went wrong</h1>
            <p style={{ color: "#5E5A6B", lineHeight: 1.6, margin: "0 0 28px" }}>
              The site hit an unexpected problem. Please try again in a moment.
            </p>
            {error.digest && <p style={{ color: "#5E5A6B", fontSize: 12 }}>Reference: {error.digest}</p>}
            <button
              type="button"
              onClick={reset}
              style={{ background: "#7545D9", color: "#fff", border: 0, borderRadius: 999, padding: "12px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
