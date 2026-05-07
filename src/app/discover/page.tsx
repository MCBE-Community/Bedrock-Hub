import Link from "next/link";

const topCreators: any[] = [];

const gamemodeCards = [
  { title: "Bedwars", desc: "Optimized packs for bed combat.", href: "/search" },
  { title: "PvP", desc: "Competitive packs for duels.", href: "/search" },
  { title: "Survival", desc: "Textures for vanilla experience.", href: "/search" },
  { title: "Skyblock", desc: "Packs for floating islands.", href: "/search" },
  { title: "Creative", desc: "Textures for builders.", href: "/search" },
];

const resolutionCards = [
  { res: "16x", desc: "Max FPS", packs: "0" },
  { res: "32x", desc: "Ideal balance", packs: "0" },
  { res: "64x", desc: "Crisp detail", packs: "0" },
  { res: "128x", desc: "High quality", packs: "0" },
  { res: "256x", desc: "Ultra detail", packs: "0" },
];

const styleCards = [
  { title: "Aesthetic", href: "/search" },
  { title: "Anime", href: "/search" },
  { title: "FPS Boost", href: "/search" },
  { title: "Shaders", href: "/search" },
  { title: "Dark", href: "/search" },
  { title: "Minimalist", href: "/search" },
];

export default function DiscoverPage() {
  return (
    <div className="container" style={{ paddingBottom: "100px" }}>
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "16px" }}>
          Discover
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
          Curated collections of the best resources for Minecraft Bedrock.
        </p>
      </div>

      <section style={{ marginBottom: "80px" }}>
        <h2 className="sectionTitle" style={{ marginBottom: "8px" }}>Top Creators</h2>
        <div style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>The most downloaded creators on the platform.</div>
        
        {topCreators.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "16px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" style={{ marginBottom: "12px" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <div style={{ color: "var(--text-muted)" }}>No creators ranked yet.</div>
          </div>
        ) : (
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
            borderRadius: "16px", overflow: "hidden",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "50px 1fr 100px 80px",
              padding: "10px 24px", borderBottom: "1px solid var(--border)",
              fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.8px",
            }}>
              <div>#</div>
              <div>Creator</div>
              <div style={{ textAlign: "right" }}>Downloads</div>
              <div style={{ textAlign: "right" }}>Packs</div>
            </div>
            {topCreators.map((c) => (
              <div key={c.rank} style={{
                display: "grid", gridTemplateColumns: "50px 1fr 100px 80px",
                padding: "14px 24px", borderBottom: "1px solid var(--border)",
                alignItems: "center", transition: "background 0.2s", cursor: "pointer",
              }}>
                <div style={{ fontWeight: 700, color: c.rank <= 3 ? "#eab308" : "var(--text-muted)" }}>{c.rank}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", fontWeight: 700,
                  }}>
                    {c.name.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                </div>
                <div style={{ textAlign: "right", fontWeight: 600 }}>{c.downloads}</div>
                <div style={{ textAlign: "right", color: "var(--text-muted)" }}>{c.packs}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: "80px" }}>
        <h2 className="sectionTitle" style={{ marginBottom: "8px" }}>By Gamemode</h2>
        <div style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Find packs optimized for your style.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          {gamemodeCards.map((c) => (
            <Link key={c.title} href={c.href}>
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
                borderRadius: "16px", padding: "24px", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer",
              }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ marginBottom: "16px" }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>{c.title}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "80px" }}>
        <h2 className="sectionTitle" style={{ marginBottom: "8px" }}>By Resolution</h2>
        <div style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Choose the quality that best fits your device.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
          {resolutionCards.map((c) => (
            <Link key={c.res} href="/search">
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
                borderRadius: "16px", padding: "24px", textAlign: "center",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer",
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "4px" }}>{c.res}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "8px" }}>{c.desc}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{c.packs} packs</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "80px" }}>
        <h2 className="sectionTitle" style={{ marginBottom: "8px" }}>By Style</h2>
        <div style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Search by your favorite aesthetic.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
          {styleCards.map((c) => (
            <Link key={c.title} href={c.href}>
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
                borderRadius: "12px", padding: "20px", textAlign: "center",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: "0 auto 12px", color: "var(--primary)" }}><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
