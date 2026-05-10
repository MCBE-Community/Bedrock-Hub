import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  try {
    const [resourceCount, totalDownloads, creatorCount] = await Promise.all([
      prisma.resource.count(),
      prisma.resource.aggregate({
        _sum: { downloads: true },
      }),
      prisma.user.count({
        where: {
          resources: {
            some: {},
          },
        },
      }),
    ]);

    return {
      resources: resourceCount || 0,
      downloads: totalDownloads._sum.downloads || 0,
      creators: creatorCount || 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { resources: 0, downloads: 0, creators: 0 };
  }
}

function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}

export default async function Home() {
  const stats = await getStats();

  return (
    <>
      <section style={{ 
        padding: "150px 0 140px", 
        textAlign: "center", 
        position: "relative",
        backgroundImage: `url(/hero.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
        minHeight: "calc(100vh + 120px)",
        marginTop: "-100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px", pointerEvents: "none",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block", padding: "6px 16px", borderRadius: "9999px",
            border: "1px solid var(--border)", fontSize: "0.85rem", fontWeight: 500,
            marginBottom: "24px", color: "var(--text-secondary)", backgroundColor: "rgba(255,255,255,0.02)",
          }}>
            The next generation of Bedrock resources
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 800, lineHeight: 1, marginBottom: "24px", letterSpacing: "-0.04em" }}>
            The Premium <br />
            <span style={{ color: "var(--text-secondary)" }}>Bedrock Ecosystem.</span>
          </h1>
          <p style={{ maxWidth: "600px", margin: "0 auto 40px", color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Discover and share the best Texture Packs, Addons and Maps.
            No invasive ads. No barriers. A purely content-focused experience.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/search" className="btnPrimary">Browse Collection</Link>
            <Link href="/upload" className="btnOutline">Upload Creation</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container">
          <h2 className="sectionTitle" style={{ marginBottom: "48px", textAlign: "center" }}>Built for Creators</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div className="featureCard">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <h3>Fast & Clean</h3>
              <p>Optimized interface, no annoying ads or endless captchas. Find what you need and download it in seconds.</p>
            </div>
            <div className="featureCard">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg>
              </div>
              <h3>Objective Rankings</h3>
              <p>Competitive tier system validated by the community through our Discord bot. Prove your skill level.</p>
            </div>
            <div className="featureCard">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3>Cross-Platform</h3>
              <p>Resources compatible with Windows, iOS, Android and Consoles. Optimized for 16x and 32x.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "64px", justifyContent: "center", flexWrap: "wrap" }}>
            <div><div className="statNumber">{stats.resources}+</div><div className="statLabel">Published Resources</div></div>
            <div><div className="statNumber">{(stats.downloads / 1000).toFixed(0)}k</div><div className="statLabel">Total Downloads</div></div>
            <div><div className="statNumber">{stats.creators}</div><div className="statLabel">Active Creators</div></div>
          </div>
        </div>
      </section>
    </>
  );
}
