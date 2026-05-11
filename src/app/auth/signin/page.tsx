"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="container" style={{ 
      minHeight: "80vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "40px 20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "rgba(10, 10, 10, 0.6)",
        backdropFilter: "blur(40px)",
        border: "1px solid var(--border)",
        borderRadius: "32px",
        padding: "40px",
        textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)"
      }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ 
            fontSize: "1.8rem", 
            fontWeight: 800, 
            marginBottom: "12px",
            letterSpacing: "-0.04em"
          }}>
            Welcome Back
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Choose your preferred way to sign in.
          </p>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <button 
            onClick={() => signIn("discord", { callbackUrl: "/" })}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
              padding: "14px", background: "#5865f2", color: "white",
              borderRadius: "16px", fontWeight: 600, fontSize: "0.95rem",
              transition: "transform 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Continue with Discord
          </button>

          <button 
            onClick={() => signIn("azure-ad", { callbackUrl: "/" })}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
              padding: "14px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border)",
              color: "white", borderRadius: "16px", fontWeight: 600, fontSize: "0.95rem",
              transition: "transform 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <svg width="20" height="20" viewBox="0 0 23 23" fill="currentColor">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
            </svg>
            Login with Microsoft (Bedrock)
          </button>
        </div>

        <div style={{ marginTop: "32px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          By signing in, you agree to our <br />
          <Link href="/terms" style={{ color: "var(--text-secondary)" }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: "var(--text-secondary)" }}>Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
