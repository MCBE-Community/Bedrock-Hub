"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    youtube: "",
    twitch: "",
    twitter: "",
    website: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user) {
      if ((session.user as any).onboardingComplete) {
        router.push("/dashboard");
      }
      setFormData(prev => ({
        ...prev,
        username: (session.user as any).username || (session.user as any).name?.replace(/[^a-zA-Z0-9_]/g, '') || "",
      }));
    }
  }, [status, session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent, skip: boolean = false) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/user/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skip }),
      });
      
      const data = await res.json();
      if (res.ok) {
        await update(); // refresh session
        router.push("/dashboard");
      } else {
        setError(data.error || "Failed to save profile");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") return <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>;

  const gamertag = (session?.user as any)?.gamertag;

  return (
    <div className="container" style={{ padding: "40px 24px 100px", maxWidth: "600px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Welcome to Bedrock Hub</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>Let&apos;s set up your creator profile</p>
      </div>

      <div className="featureCard" style={{ padding: "32px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "16px" }}>Minecraft Account (Required for Tier Testing)</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "20px" }}>
          Link your Xbox Live account to automatically verify your Gamertag and render your skin in 3D.
        </p>
        
        {gamertag ? (
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "0.85rem", color: "#22c55e", fontWeight: 600, marginBottom: "4px" }}>✓ Account Linked</div>
              <strong style={{ fontSize: "1.2rem" }}>{gamertag}</strong>
            </div>
            {session?.user?.image && <img src={session.user.image} alt="" style={{ width: 48, height: 48, borderRadius: "8px" }} />}
          </div>
        ) : (
          <button 
            type="button" 
            className="btnPrimary" 
            style={{ width: "100%", background: "#107C10", color: "#fff", borderColor: "#107C10" }}
            onClick={() => signIn("azure-ad")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "8px", verticalAlign: "middle" }}><path d="M11.4 24l-11.4-2.2v-10.2h11.4v12.4zm1-12.4v12.6l11.6-2.2v-10.4h-11.6zm-1-10.8l-11.4 1.6v9.2h11.4v-10.8zm1 10.8h11.6v-9.4l-11.6 1.6v7.8z"/></svg>
            Link Xbox Account
          </button>
        )}
      </div>

      <form onSubmit={(e) => handleSave(e, false)} className="featureCard" style={{ padding: "32px" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "24px" }}>Profile Details</h2>
        
        <div className="formGroup">
          <label className="formLabel">Username (for your custom URL)</label>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
            <span style={{ padding: "0 12px", color: "var(--text-muted)", borderRight: "1px solid var(--border)", background: "rgba(0,0,0,0.2)" }}>bedrockhub.io/p/</span>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{ flex: 1, background: "transparent", border: "none", padding: "12px", color: "#fff", outline: "none" }}
              placeholder="username"
              required
            />
          </div>
        </div>

        <div className="formGroup">
          <label className="formLabel">Bio</label>
          <textarea 
            name="bio"
            className="formInput" 
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows={3}
            style={{ resize: "none" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="formGroup">
            <label className="formLabel">YouTube</label>
            <input type="text" name="youtube" className="formInput" value={formData.youtube} onChange={handleChange} placeholder="Channel URL" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Twitch</label>
            <input type="text" name="twitch" className="formInput" value={formData.twitch} onChange={handleChange} placeholder="Twitch username" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Twitter</label>
            <input type="text" name="twitter" className="formInput" value={formData.twitter} onChange={handleChange} placeholder="@username" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Website</label>
            <input type="url" name="website" className="formInput" value={formData.website} onChange={handleChange} placeholder="https://" />
          </div>
        </div>

        {error && <div style={{ padding: "12px", color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", marginBottom: "16px", textAlign: "center" }}>{error}</div>}

        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button type="button" className="btnOutline" style={{ flex: 1 }} onClick={(e) => handleSave(e, true)} disabled={saving}>
            Skip for now
          </button>
          <button type="submit" className="btnPrimary" style={{ flex: 2 }} disabled={saving}>
            {saving ? "Saving..." : "Complete Setup"}
          </button>
        </div>
      </form>
    </div>
  );
}
