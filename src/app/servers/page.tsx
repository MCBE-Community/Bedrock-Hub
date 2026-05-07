"use client";

import { useState } from "react";

const initialServers: any[] = [];

export default function ServersPage() {
  const [servers, setServers] = useState(initialServers);
  const [search, setSearch] = useState("");
  const [voted, setVoted] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"votes" | "players">("votes");

  const filtered = servers
    .filter(s => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.ip.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q));
    })
    .sort((a, b) => sortBy === "votes" ? b.votes - a.votes : 0);

  const handleVote = (id: number) => {
    if (voted.has(id)) return;
    setServers(servers.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s));
    setVoted(prev => { const next = new Set(Array.from(prev)); next.add(id); return next; });
  };

  const handleCopyIp = (id: number, ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container" style={{ paddingBottom: "100px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "16px" }}>
          Bedrock Servers
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
          Find and vote for the best Minecraft Bedrock Edition servers.
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
        <div className="searchWrap" style={{ flex: 1, minWidth: "280px", marginBottom: 0 }}>
          <svg className="searchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text" className="searchInput"
            placeholder="Search servers, IPs, tags..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "6px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "9999px", padding: "4px" }}>
          <button onClick={() => setSortBy("votes")} style={{
            padding: "10px 20px", borderRadius: "9999px", border: "none", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
            background: sortBy === "votes" ? "var(--primary)" : "transparent",
            color: sortBy === "votes" ? "#000" : "var(--text-secondary)",
            transition: "all 0.25s",
          }}>
            By Votes
          </button>
          <button onClick={() => setSortBy("players")} style={{
            padding: "10px 20px", borderRadius: "9999px", border: "none", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
            background: sortBy === "players" ? "var(--primary)" : "transparent",
            color: sortBy === "players" ? "#000" : "var(--text-secondary)",
            transition: "all 0.25s",
          }}>
            By Players
          </button>
        </div>
      </div>

      <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
        {filtered.length} servers
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((server, i) => (
          <div key={server.id} style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
            borderRadius: "16px", padding: "24px",
            display: "grid", gridTemplateColumns: "auto 1fr auto",
            gap: "24px", alignItems: "center", transition: "all 0.3s",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "10px",
              background: i < 3 ? "rgba(234,179,8,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${i < 3 ? "rgba(234,179,8,0.2)" : "var(--border)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "0.9rem",
              color: i < 3 ? "#eab308" : "var(--text-muted)",
            }}>
              {i + 1}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{server.name}</h3>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              </div>

              <button
                onClick={() => handleCopyIp(server.id, server.ip)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontFamily: "monospace", color: "var(--text-muted)", fontSize: "0.85rem",
                  marginBottom: "12px", cursor: "pointer", padding: "4px 10px",
                  borderRadius: "6px", background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)", transition: "all 0.2s",
                }}
              >
                {copied === server.id ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ color: "#22c55e" }}>IP Copied!</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    {server.ip}
                  </>
                )}
              </button>

              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                {server.tags.map((tag) => (
                  <span key={tag} style={{
                    padding: "3px 10px", background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)", borderRadius: "6px",
                    fontSize: "0.75rem", color: "var(--text-secondary)",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {server.players}
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {server.votes.toLocaleString()} votes
              </div>
              <button
                onClick={() => handleVote(server.id)}
                disabled={voted.has(server.id)}
                className="btnPrimary"
                style={{
                  padding: "8px 24px", fontSize: "0.85rem",
                  opacity: voted.has(server.id) ? 0.5 : 1,
                  background: voted.has(server.id) ? "rgba(255,255,255,0.06)" : undefined,
                  color: voted.has(server.id) ? "var(--text-secondary)" : undefined,
                }}
              >
                {voted.has(server.id) ? "Voted" : "Vote"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" style={{ marginBottom: 16 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <div style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>No servers found.</div>
        </div>
      )}
    </div>
  );
}
