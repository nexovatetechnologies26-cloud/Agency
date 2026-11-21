// Re-mounts on every navigation, giving each public page a short, calm fade-in.
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
