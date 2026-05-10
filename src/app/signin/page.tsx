"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  const handleSignIn = async () => {
    if (typeof window === "undefined") return;
    await signIn("discord", { callbackUrl: window.location.origin });
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.03) 100%)",
      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 50%), linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.03) 100%)`,
      minHeight: "100vh",
    }}>
    <div className="container" style={{ paddingBottom: "100px", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: "18px" }}>Sign in to BedrockHub</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px", lineHeight: 1.7 }}>
          Use Discord to sign in and upload resources, manage your profile, and access community features.
        </p>
        <button onClick={handleSignIn} className="btnPrimary" style={{ width: "100%", padding: "16px", fontSize: "1rem" }}>
          Continue with Discord
        </button>
        <div style={{ marginTop: "24px", color: "var(--text-muted)", fontSize: "0.95rem" }}>
          If the login does not work, make sure your Discord app redirect URI is set to <strong>http://localhost:3000/api/auth/callback/discord</strong>.
        </div>
      </div>
    </div>
  );
}
