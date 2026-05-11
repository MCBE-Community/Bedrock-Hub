"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Player = {
  rank: number;
  name: string;
  peak: string;
  attained: string;
};

type TierGroup = {
  tier: string;
  color: string;
  bg: string;
  players: Player[];
};

const rankingsData: Record<string, TierGroup[]> = {
  Overall: [],
  Sword: [],
  Mace: [],
};

const categories = ["Overall", "Sword", "Mace"] as const;

export default function RankingsPage() {
  const { data: session } = useSession();
  const sessionUser = session?.user as any;
  const [active, setActive] = useState<string>("Overall");
  const [search, setSearch] = useState("");
  const tiers = rankingsData[active] || [];

  const filteredTiers = tiers.map(t => ({
    ...t,
    players: t.players.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(t => t.players.length > 0);

  const totalPlayers = tiers.reduce((acc, t) => acc + t.players.length, 0);

  return (
    <div className="container" style={{ paddingBottom: "100px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          marginBottom: "16px",
        }}>
          Rankings & Tier List
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.6 }}>
          Competitive PvP rankings for Minecraft Bedrock Edition.
        </p>
      </div>

      <div style={{
        display: "flex", gap: "6px", justifyContent: "center", marginBottom: "40px",
        background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
        borderRadius: "9999px", padding: "4px", width: "fit-content", margin: "0 auto 40px",
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              padding: "10px 24px", borderRadius: "9999px", border: "none",
              background: active === cat ? "var(--primary)" : "transparent",
              color: active === cat ? "#000" : "var(--text-secondary)",
              fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "32px", flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          <span style={{ fontWeight: 600, color: "var(--primary)" }}>{totalPlayers}</span> players ranked in <span style={{ fontWeight: 600, color: "var(--primary)" }}>{active}</span>
        </div>
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "var(--text-muted)", pointerEvents: "none" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px 16px 10px 40px", background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)", borderRadius: "9999px",
              color: "var(--text)", fontSize: "0.9rem", outline: "none", width: "260px",
              transition: "border-color 0.2s",
            }}
          />
        </div>
      </div>

      {filteredTiers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" style={{ marginBottom: 16 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <div style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>No players found.</div>
        </div>
      ) : (
        filteredTiers.map((tierGroup) => (
          <section key={tierGroup.tier} style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                padding: "4px 14px", background: tierGroup.color, borderRadius: "6px",
                fontWeight: 800, fontSize: "0.85rem", color: "#000", letterSpacing: "0.5px",
              }}>
                {tierGroup.tier}
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                {tierGroup.players.length} {tierGroup.players.length === 1 ? "player" : "players"}
              </span>
            </div>

            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "16px", overflow: "hidden",
            }}>
              <div style={{
                display: "grid", gridTemplateColumns: "60px 1fr 100px 140px",
                padding: "10px 24px", borderBottom: "1px solid var(--border)",
                fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.8px",
              }}>
                <div>#</div>
                <div>Player</div>
                <div style={{ textAlign: "center" }}>Peak</div>
                <div style={{ textAlign: "right" }}>Attained</div>
              </div>

              {tierGroup.players.map((p, index) => (
                <div key={p.name} style={{
                  display: "grid", gridTemplateColumns: "60px 1fr 100px 140px",
                  padding: "14px 24px", borderBottom: index < tierGroup.players.length - 1 ? "1px solid var(--border)" : "none",
                  alignItems: "center", transition: "background 0.2s", cursor: "default",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ fontWeight: 700, color: "var(--text-muted)" }}>
                    {p.rank}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "4px", background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--border)", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "var(--text-muted)"
                    }}>
                      {p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{p.name}</span>
                  </div>
                  <div style={{ textAlign: "center", fontWeight: 700, color: "var(--text)" }}>
                    {p.peak}
                  </div>
                  <div style={{ textAlign: "right", color: "var(--text-muted)", fontSize: "0.85rem", fontFamily: "monospace" }}>
                    {p.attained}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
