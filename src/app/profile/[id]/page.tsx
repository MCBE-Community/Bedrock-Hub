"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string | null;
  image: string | null;
  gamertag: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  discord: string | null;
  joinedAt: string;
  _count: {
    resources: number;
    likes: number;
  };
}

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`/api/profile/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setUser(data.user);
          }
        })
        .catch(() => setError("Failed to load profile"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--primary)", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingBottom: "100px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>Profile Not Found</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>{error}</p>
        <Link href="/" className="btnPrimary">Go Home</Link>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container" style={{ paddingBottom: "100px", maxWidth: "720px" }}>
      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
          {user.image ? (
            <img src={user.image} alt="" style={{ width: 80, height: 80, borderRadius: "50%" }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 700, color: "#000" }}>
              {user.name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>{user.name || "Anonymous"}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              Joined {new Date(user.joinedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {user.bio && (
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "24px" }}>
            {user.bio}
          </p>
        )}
      </div>

      <div style={{ display: "grid", gap: "18px", marginBottom: "30px" }}>
        {user.website && (
          <div style={{ display: "grid", gap: "4px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Website</span>
            <a href={user.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "1rem", color: "var(--primary)" }}>
              {user.website}
            </a>
          </div>
        )}
        {user.twitter && (
          <div style={{ display: "grid", gap: "4px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Twitter</span>
            <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "1rem", color: "var(--primary)" }}>
              @{user.twitter}
            </a>
          </div>
        )}
        {user.discord && (
          <div style={{ display: "grid", gap: "4px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Discord</span>
            <strong style={{ fontSize: "1rem" }}>{user.discord}</strong>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "30px" }}>
        <div style={{ padding: "20px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>{user._count.resources}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Uploads</div>
        </div>
        <div style={{ padding: "20px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>{user._count.likes}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Likes</div>
        </div>
      </div>

      <Link href="/" className="btnOutline">Back to Home</Link>
    </div>
  );
}