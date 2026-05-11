"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    website: "",
    twitter: "",
    discord: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user) {
      setFormData({
        name: session.user.name || "",
        bio: (session.user as any).bio || "",
        website: (session.user as any).website || "",
        twitter: (session.user as any).twitter || "",
        discord: (session.user as any).discord || "",
      });
    }
  }, [status, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) setMessage("Settings updated!");
      else setMessage("Failed to update settings.");
    } catch (e) {
      setMessage("Error occurred.");
    }
    setSaving(false);
  };

  if (status === "loading") return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "32px" }}>Account Settings</h1>
        
        <form onSubmit={handleSubmit} className="featureCard" style={{ padding: "32px", display: "grid", gap: "24px" }}>
          <div className="formGroup">
            <label className="formLabel">Display Name</label>
            <input 
              className="formInput" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="formGroup">
            <label className="formLabel">Biography</label>
            <textarea 
              className="formInput" 
              rows={4} 
              value={formData.bio} 
              onChange={e => setFormData({...formData, bio: e.target.value})} 
              placeholder="Tell the community about yourself..."
              style={{ resize: "none" }}
            />
          </div>
          <div className="formGroup">
            <label className="formLabel">Social Links</label>
            <div style={{ display: "grid", gap: "12px" }}>
              <input className="formInput" placeholder="Website URL" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
              <input className="formInput" placeholder="Twitter Username" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} />
              <input className="formInput" placeholder="Discord Tag" value={formData.discord} onChange={e => setFormData({...formData, discord: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btnPrimary" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
          {message && <div style={{ textAlign: "center", color: message.includes("updated") ? "#22c55e" : "#ef4444" }}>{message}</div>}
        </form>
      </div>
    </div>
  );
}
