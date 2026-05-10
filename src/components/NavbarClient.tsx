"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Browse" },
  { href: "/upload", label: "Upload" },
  { href: "/rankings", label: "Rankings" },
];

export function NavbarClient() {
  const { data: session, status } = useSession();
  const sessionUser = session?.user as any;
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="navbarWrap">
      <nav className={`navbar ${isScrolled ? 'navbarScrolled' : ''}`}>
        <Link href="/" className="navLogo">BedrockHub</Link>
        
        {/* Mobile menu button */}
        <button 
          className="mobileMenuBtn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12"/>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </>
            )}
          </svg>
        </button>

        {/* Desktop nav links */}
        <ul className="navLinks">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="navLink">{l.label}</Link></li>
          ))}
        </ul>

        {/* Auth section */}
        {status === "loading" ? (
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.06)", animation: "pulse 1.5s infinite" }} />
        ) : session?.user ? (
          <div style={{ position: "relative" }}>
            <button onClick={() => setOpen(!open)} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "4px 12px 4px 4px",
              borderRadius: "9999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", cursor: "pointer",
            }}>
              {sessionUser?.image ? (
                <img src={sessionUser.image} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "#000" }}>
                  {session.user.name?.charAt(0) || "U"}
                </div>
              )}
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>{sessionUser?.name}</span>
            </button>
            {open && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)",
                border: "1px solid var(--border)", borderRadius: "12px", padding: "8px", minWidth: "180px", zIndex: 200,
              }}>
                <div style={{ padding: "10px 14px", fontSize: "0.8rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", marginBottom: "4px" }}>
                  {sessionUser?.email}
                </div>
                <Link href="/profile" onClick={() => setOpen(false)} style={{
                  display: "block", padding: "10px 14px", fontSize: "0.9rem", borderRadius: "8px", color: "var(--text)",
                }}>Profile</Link>
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
          <button 
            onClick={() => {
              if (typeof window !== "undefined") {
                signIn("discord", {
                  callbackUrl: window.location.origin,
                });
              }
            }}
            className="signInBtn"
          >
            Sign In
          </button>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mobileMenu">
            <div className="mobileMenuInner">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="mobileNavLink">
                  {l.label}
                </Link>
              ))}
              {session?.user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="mobileNavLink">
                    Profile
                  </Link>
                  <Link href="/upload" onClick={() => setMobileMenuOpen(false)} className="mobileNavLink">
                    Upload Resource
                  </Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="mobileNavLink" style={{ color: "#ef4444" }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    signIn("discord", { callbackUrl: window.location.origin });
                    setMobileMenuOpen(false);
                  }}
                  className="mobileNavLink"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
