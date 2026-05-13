import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  try {
    const [resourceCount, totalDownloads, creatorCount] = await Promise.all([
      prisma.resource.count({ where: { status: "APPROVED" } }),
      prisma.resource.aggregate({
        where: { status: "APPROVED" },
        _sum: { downloads: true },
      }),
      prisma.user.count({
        where: {
          resources: {
            some: { status: "APPROVED" },
          },
        },
      }),
    ]);

    return {
      resources: resourceCount || 0,
      downloads: totalDownloads._sum?.downloads || 0,
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

export const revalidate = 60;

export default async function Home() {
  const stats = await getStats();
  let trending: any[] = [];
  try {
    trending = await prisma.resource.findMany({
      where: { status: "APPROVED" },
      orderBy: { downloads: "desc" },
      include: { author: { select: { name: true } } },
      take: 4,
    });
  } catch (e) {
    console.warn("Could not fetch trending (no database connected)");
  }

  return (
    <>
      <section style={{
        padding: "150px 0 140px",
        position: "relative",
        backgroundImage: `linear-gradient(180deg, rgba(3, 9, 23, 0.85), rgba(3, 9, 23, 0.2)), url('/hero.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "fixed",
        minHeight: "calc(100vh + 120px)",
        marginTop: "-100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25))", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: "48px 48px", opacity: 0.35, pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 18px", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.16)", color: "#d7e1ff", marginBottom: "24px", background: "rgba(255,255,255,0.06)" }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#60a5fa" }} />
            Trusted hub for Bedrock creators and players
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 800, lineHeight: 1.02, marginBottom: "24px", letterSpacing: "-0.06em", color: "#ffffff" }}>
            Welcome to BedrockHub
          </h1>
          <p style={{ maxWidth: "680px", margin: "0 auto 40px", color: "rgba(255,255,255,0.88)", fontSize: "1.1rem", lineHeight: 1.7 }}>
            Browse hand-picked Texture Packs, Add-Ons, Maps and creator tools built for Minecraft Bedrock. All resources are curated for quality and compatibility.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/discover" className="btnPrimary">Browse Collection</Link>
            <a href="https://discord.gg/TQDvhvregC" target="_blank" rel="noopener noreferrer" className="btnOutline">Join Discord</a>
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

      <section style={{ padding: "100px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
            <div>
              <h2 className="sectionTitle" style={{ textAlign: "left", marginBottom: "8px" }}>Trending Now</h2>
              <p style={{ color: "var(--text-secondary)" }}>The most downloaded resources this week.</p>
            </div>
            <Link href="/discover" className="btnOutline">View All</Link>
          </div>
          <div className="gridResources">
            {trending.map((pack) => (
              <Link key={pack.id} href={`/resource/${pack.id}`} style={{ textDecoration: "none" }}>
                <div className="resourceCard">
                  <div className="cardImageWrap">
                    <img src={pack.thumbnail || "/placeholder.png"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div className="cardBadge">{pack.resolution || "Pack"}</div>
                  </div>
                  <div className="cardBody">
                    <div className="cardTitle">{pack.title}</div>
                    <div className="cardAuthor">by {pack.author?.name || "Unknown"}</div>
                    <div className="cardFooter">
                      <div className="cardDownloads">
                        <DownloadIcon />
                        {pack.downloads.toLocaleString()}
                      </div>
                      <div className="cardTag">{pack.category}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ maxWidth: "680px", margin: "0 auto 40px", textAlign: "center" }}>
            <h2 className="sectionTitle">Browse by Category</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.75 }}>
              Find Texture Packs, Add-Ons, Maps and creator tools that fit your next Minecraft Bedrock project.
            </p>
          </div>
          <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div className="featureCard" style={{ padding: "28px 24px" }}>
              <h3>Texture Packs</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>High-quality visuals built for smooth Bedrock performance.</p>
            </div>
            <div className="featureCard" style={{ padding: "28px 24px" }}>
              <h3>Add-Ons</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>Gameplay expansions, mobs, and mechanics for your world.</p>
            </div>
            <div className="featureCard" style={{ padding: "28px 24px" }}>
              <h3>Maps & Worlds</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>Adventure, survival and creative maps ready to play.</p>
            </div>
            <div className="featureCard" style={{ padding: "28px 24px" }}>
              <h3>Creator Tools</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>Resources to help creators publish faster and smarter.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
            <div>
              <h2 className="sectionTitle" style={{ marginBottom: "8px" }}>How it works</h2>
              <p style={{ color: "var(--text-secondary)" }}>Browse, download, and publish Bedrock content without the usual friction.</p>
            </div>
            <Link href="/upload" className="btnOutline">Upload your resource</Link>
          </div>
          <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            <div className="featureCard" style={{ padding: "28px 24px" }}>
              <h3>Discover quality content</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>Search through vetted packs and maps by category, author, or popularity.</p>
            </div>
            <div className="featureCard" style={{ padding: "28px 24px" }}>
              <h3>Download with confidence</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>Every resource goes through review so you get working downloads every time.</p>
            </div>
            <div className="featureCard" style={{ padding: "28px 24px" }}>
              <h3>Share your work</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>Upload your own creation and connect with the Bedrock community.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 0", textAlign: "center", backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "64px", justifyContent: "center", flexWrap: "wrap" }}>
            <div>
              <div className="statNumber">{stats.resources.toLocaleString()}</div>
              <div className="statLabel">Published Resources</div>
            </div>
            <div>
              <div className="statNumber">{stats.downloads.toLocaleString()}</div>
              <div className="statLabel">Verified Downloads</div>
            </div>
            <div>
              <div className="statNumber">{stats.creators.toLocaleString()}</div>
              <div className="statLabel">Active Creators</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
