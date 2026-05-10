"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    OAuthSignin: "Error connecting to Discord. Check your Discord application settings.",
    OAuthCallback: "Discord redirect failed. Ensure the redirect URI is correct in Discord app.",
    OAuthCreateAccount: "Could not create account. Try signing in again.",
    EmailCreateAccount: "Could not create account with email.",
    Callback: "Authorization callback failed. Check server logs.",
    OAuthAccountNotLinked: "Email already exists with another provider.",
    EmailSignInError: "Email sign in error.",
    CredentialsSignin: "Invalid credentials.",
    Default: "Authentication failed. Please try again.",
  };

  const message = errorMessages[error as string] || errorMessages.Default;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.03) 100%)",
      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 50%), linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.03) 100%)`,
      minHeight: "100vh",
    }}>
    <div className="container" style={{ paddingBottom: "100px", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.1)", border: "2px solid rgba(239, 68, 68, 0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px", color: "#ef4444",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "12px", color: "#ef4444" }}>
          Authentication Error
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "12px", fontSize: "1rem", lineHeight: 1.6 }}>
          {message}
        </p>
        {error && (
          <div style={{
            padding: "12px 16px", marginBottom: "24px",
            background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px", color: "#ef4444", fontSize: "0.85rem", fontFamily: "monospace",
          }}>
            Error: {error}
          </div>
        )}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btnPrimary">Go Home</Link>
          <button onClick={() => window.location.href = "/"} className="btnOutline">Try Again</button>
        </div>
      </div>
    </div>
  );
}
