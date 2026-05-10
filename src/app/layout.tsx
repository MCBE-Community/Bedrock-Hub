import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Providers } from "@/components/Providers";
import { NavbarClient } from "@/components/NavbarClient";

export const metadata: Metadata = {
  title: "Bedrock Hub — Resources, Rankings & Servers",
  description: "Download the best Minecraft Bedrock resources. Texture Packs, Addons, Maps, Skins and more. Tier rankings, server list and community hub.",
};

const footerLinks = [
  { title: "Resources", links: ["Texture Packs", "Addons", "Maps", "Skins"] },
  { title: "Resolutions", links: ["16x", "32x", "64x", "128x"] },
  { title: "Categories", links: ["PvP", "Survival", "FPS Boost", "Aesthetic"] },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavbarClient />
          <main style={{ minHeight: "calc(100vh - 200px)", paddingTop: "100px" }}>
            {children}
          </main>
          <footer className="footer">
            <div className="container">
              <div className="footerInner">
                <div className="footerTop">
                  <div style={{ display: "grid", gap: "16px" }}>
                    <div className="footerLogo">BedrockHub</div>
                    <p style={{ maxWidth: "380px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                      The easiest place to find, upload, and support Bedrock resources, servers, and communities.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
                    {footerLinks.map((group) => (
                      <div key={group.title} className="footerLinksGroup">
                        <span>{group.title}</span>
                        {group.links.map(link => (
                          <Link key={link} href={`/search?q=${link.toLowerCase().replace(/ /g, '-')}`}>{link}</Link>
                        ))}
                      </div>
                    ))}
                    <div className="footerLinksGroup">
                      <span>Company</span>
                      <Link href="/terms">Terms</Link>
                      <Link href="/privacy">Privacy</Link>
                      <Link href="/guidelines">Guidelines</Link>
                    </div>
                  </div>
                </div>
                <div className="footerBottom">
                  <div>© 2026 BedrockHub. Not affiliated with Mojang AB.</div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                    <a href="https://discord.gg/" target="_blank" rel="noopener">Discord</a>
                    <a href="https://twitter.com/" target="_blank" rel="noopener">Twitter</a>
                    <a href="/auth-error">Support</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
