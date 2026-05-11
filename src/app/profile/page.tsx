"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gamertag, setGamertag] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user) {
      setGamertag((session.user as any).gamertag || "");
    }
  }, [status, session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gamertag }),
      });
      if (res.ok) {
        setMessage("Profile updated successfully!");
      } else {
        const error = await res.json();
        setMessage(error.error || "Update failed");
      }
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px" }}>
          {session?.user?.image ? (
            <img src={session.user.image} alt="" style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid var(--border)" }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "#000", fontWeight: 800 }}>
              {session?.user?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>{session?.user?.name}</h1>
            <p style={{ color: "var(--text-secondary)" }}>{session?.user?.email}</p>
            <div style={{ 
              display: "inline-block", padding: "4px 12px", borderRadius: "9999px", 
              background: (session?.user as any).role === "ADMIN" ? "rgba(59, 130, 246, 0.1)" : "rgba(255,255,255,0.05)",
              color: (session?.user as any).role === "ADMIN" ? "#3b82f6" : "var(--text-secondary)",
              fontSize: "0.8rem", fontWeight: 600, marginTop: "8px", border: "1px solid currentColor"
            }}>
              {(session?.user as any).role || "USER"}
            </div>
          </div>
        </div>

        <div className="featureCard" style={{ padding: "32px" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "24px" }}>Bedrock Identity</h2>
          <form onSubmit={handleSave}>
            <div className="formGroup">
              <label className="formLabel">Minecraft Gamertag</label>
              <div style={{ position: "relative" }}>
                <input 
                  type="text" 
                  className="formInput" 
                  placeholder="Enter your Gamertag"
                  value={gamertag}
                  onChange={(e) => setGamertag(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                />
                <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>
                Your gamertag will be used for rankings and server verification.
              </p>
            </div>

            <button 
              type="submit" 
              className="btnPrimary" 
              style={{ width: "100%", marginTop: "12px" }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {message && (
              <p style={{ 
                marginTop: "16px", textAlign: "center", fontSize: "0.9rem",
                color: message.includes("success") ? "#22c55e" : "#ef4444"
              }}>
                {message}
              </p>
            )}
          </form>
        </div>

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Want to verify your account officially? <br />
            <span style={{ color: "var(--primary)", cursor: "pointer" }}>Join our Discord</span> to link your Xbox account.
          </p>
        </div>
      </div>
    </div>
  );
}
