"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Browse" },
  { href: "/upload", label: "Upload" },
  { href: "/rankings", label: "Rankings" },
];

export function NavbarClient() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className="navbarWrap">
      <nav className="navbar">
        <Link href="/" className="navLogo">BedrockHub</Link>
        <ul className="navLinks">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="navLink">{l.label}</Link></li>
          ))}
        </ul>
        {status === "loading" ? (
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.06)", animation: "pulse 1.5s infinite" }} />
        ) : session?.user ? (
          <div style={{ position: "relative" }}>
            <button onClick={() => setOpen(!open)} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "4px 12px 4px 4px",
              borderRadius: "9999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", cursor: "pointer",
            }}>
              {session.user.image ? (
                <img src={session.user.image} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "#000" }}>
                  {session.user.name?.charAt(0) || "U"}
                </div>
              )}
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>{session.user.name}</span>
            </button>
            {open && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)",
                border: "1px solid var(--border)", borderRadius: "12px", padding: "8px", minWidth: "180px", zIndex: 200,
              }}>
                <div style={{ padding: "10px 14px", fontSize: "0.8rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", marginBottom: "4px" }}>
                  {session.user.email}
                </div>
                <Link href="/upload" onClick={() => setOpen(false)} style={{
                  display: "block", padding: "10px 14px", fontSize: "0.9rem", borderRadius: "8px", color: "var(--text)",
                }}>Upload Resource</Link>
                <button onClick={() => signOut()} style={{
                  display: "block", width: "100%", padding: "10px 14px", fontSize: "0.9rem",
                  borderRadius: "8px", textAlign: "left", color: "#ef4444",
                }}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => signIn("discord")} className="signInBtn">Sign In</button>
        )}
      </nav>
    </div>
  );
}
