"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const sessionUser = session?.user as any;
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sessionUser) {
      setName(sessionUser.name || "");
      setBio(sessionUser.bio || "");
      setWebsite(sessionUser.website || "");
      setTwitter(sessionUser.twitter || "");
      setDiscord(sessionUser.discord || "");
    }
  }, [sessionUser]);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--primary)", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>Profile Access Required</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "24px", maxWidth: "420px" }}>
          You need to sign in with Discord before you can manage your profile.
        </p>
        <button onClick={() => signIn("discord")} className="btnPrimary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
          Sign in with Discord
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, website, twitter, discord }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to save profile.");
      setMessage("Profile saved successfully.");
    } catch (err: any) {
      setError(err.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: "100px", maxWidth: "720px" }}>
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "12px" }}>Profile</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "680px" }}>
          Manage your BedrockHub profile, including your display name, bio, and social links.
        </p>
      </div>

      <div style={{ display: "grid", gap: "18px", marginBottom: "30px" }}>
        <div style={{ display: "grid", gap: "4px" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Discord</span>
          <strong style={{ fontSize: "1rem" }}>{sessionUser?.email}</strong>
        </div>
        <div style={{ display: "grid", gap: "4px" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Joined</span>
          <strong style={{ fontSize: "1rem" }}>{sessionUser?.joinedAt ? new Date(sessionUser.joinedAt).toLocaleDateString() : "Unknown"}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "24px" }}>
        {error && (
          <div style={{ padding: "14px 18px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", color: "#ef4444" }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ padding: "14px 18px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", color: "#22c55e" }}>
            {message}
          </div>
        )}

        <div className="formGroup">
          <label className="formLabel">Display Name</label>
          <input className="formInput" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your profile name" />
        </div>

        <div className="formGroup">
          <label className="formLabel">Bio</label>
          <textarea className="formTextarea" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." />
        </div>

        <div className="formGroup">
          <label className="formLabel">Website</label>
          <input className="formInput" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" />
        </div>

        <div className="formGroup">
          <label className="formLabel">Twitter</label>
          <input className="formInput" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@yourtwitter" />
        </div>

        <div className="formGroup">
          <label className="formLabel">Discord Username</label>
          <input className="formInput" value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="YourDiscord#1234" />
        </div>

        <button type="submit" disabled={saving} className="btnPrimary" style={{ width: "100%", padding: "16px", fontSize: "1rem", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving profile..." : "Save Profile"}
        </button>
      </form>

      <div style={{ marginTop: "28px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
        <p>
          Your profile helps other players recognize you on BedrockHub.
        </p>
        <p>
          <Link href="/rankings" className="btnOutline" style={{ marginTop: "12px", display: "inline-block" }}>
            View Rankings
          </Link>
        </p>
      </div>
    </div>
  );
}
