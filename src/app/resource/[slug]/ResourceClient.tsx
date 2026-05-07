"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResourceClient({ resource }: { resource: any }) {
  const [downloading, setDownloading] = useState(false);
  const [dlCount, setDlCount] = useState(resource.downloads || 0);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/resources/${resource.id}/download`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        setDlCount((prev: number) => prev + 1);
      }
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  };

  const tags = resource.tags ? resource.tags.split(",").map((t: string) => t.trim()) : [];
  const imageUrl = resource.thumbnails ? resource.thumbnails.split(",")[0] : null;

  return (
    <div className="container" style={{ paddingBottom: "100px" }}>
      <div style={{ marginBottom: "32px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        <Link href="/" style={{ transition: "color 0.2s" }}>Home</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link href="/search" style={{ transition: "color 0.2s" }}>Browse</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{resource.title}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }}>
        <div>
          <div style={{
            width: "100%", aspectRatio: "16/9", background: "#0a0a0a",
            borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "32px", border: "1px solid var(--border)",
            position: "relative", overflow: "hidden",
          }}>
            {imageUrl ? (
              <img src={imageUrl} alt={resource.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            )}
          </div>

          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "16px" }}>
            {resource.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border)", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, overflow: "hidden"
            }}>
              {resource.author?.image ? (
                <img src={resource.author.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                resource.author?.name?.charAt(0) || "U"
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{resource.author?.name || "Unknown"}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {new Date(resource.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "1.1rem" }}>Description</h3>
            <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-line", fontSize: "0.95rem" }}>
              {resource.description || "No description provided."}
            </div>
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "28px", position: "sticky", top: "140px",
        }}>
          <button onClick={handleDownload} disabled={downloading} className="btnPrimary"
            style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem", marginBottom: "24px", opacity: downloading ? 0.6 : 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {downloading ? "Downloading..." : "Download File"}
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "4px" }}>Downloads</div>
              <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{dlCount.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "4px" }}>Category</div>
              <div style={{ fontWeight: 600 }}>{resource.category}</div>
            </div>
            {resource.resolution && (
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "4px" }}>Resolution</div>
                <div style={{ fontWeight: 600 }}>{resource.resolution}</div>
              </div>
            )}
            {tags.length > 0 && (
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "8px" }}>Tags</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {tags.map((t: string) => (
                    <Link key={t} href={`/search?tag=${t}`} style={{
                      padding: "4px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
                      borderRadius: "6px", fontSize: "0.8rem", color: "var(--text-secondary)", transition: "all 0.2s",
                    }}>
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
