import "server-only";
import { config } from "@/server/config";

// Transactional email through Resend's HTTP API (no SDK needed).
// Without RESEND_API_KEY, emails are printed to the server console instead —
// useful in development, and never fails the user's request.

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function layout(title: string, paragraphs: string[], cta?: { label: string; url: string }) {
  const body = paragraphs.map((p) => `<p style="margin:0 0 14px;line-height:1.6">${escape(p)}</p>`).join("");
  const button = cta
    ? `<p style="margin:24px 0"><a href="${escape(cta.url)}" style="background:#4A3268;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600">${escape(cta.label)}</a></p>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#F7F6FA;font-family:Arial,Helvetica,sans-serif;color:#17151F">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <p style="font-size:20px;font-weight:800;margin:0 0 24px">Ne<span style="color:#4A3268">x</span>ovate</p>
    <div style="background:#fff;border:1px solid #E8E6ED;border-radius:16px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 16px">${escape(title)}</h1>${body}${button}
    </div>
    <p style="font-size:12px;color:#5E5A6B;margin-top:20px">Nexovate · Build • Automate • Market • Grow</p>
  </div></body></html>`;
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!config.email.enabled) {
    console.info(`[email:dev] to=${to} subject="${subject}"\n${html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 600)}`);
    return { sent: false };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.email.resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: config.email.from, to: [to], subject, html }),
    });
    if (!res.ok) console.error("[email] send failed", res.status, await res.text().catch(() => ""));
    return { sent: res.ok };
  } catch (err) {
    console.error("[email] send error", err);
    return { sent: false };
  }
}

export async function notifyTeam(subject: string, lines: string[], url?: string) {
  if (!config.email.notify) return;
  await sendEmail(config.email.notify, subject, layout(subject, lines, url ? { label: "Open in admin", url } : undefined));
}
