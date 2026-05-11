"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ForumsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/forums/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px" }}>Community Forums</h1>
        <p style={{ color: "var(--text-secondary)" }}>Discuss, share, and get help from the Bedrock community.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "100px" }}>Loading Forums...</div>
      ) : (
        <div style={{ display: "grid", gap: "24px" }}>
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/forums/category/${cat.id}`} style={{ textDecoration: "none" }}>
              <div className="featureCard" style={{ 
                padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "transform 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div>
                  <h2 style={{ fontSize: "1.4rem", marginBottom: "8px", color: "var(--text)" }}>{cat.name}</h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{cat.description}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{cat._count?.threads || 0}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Threads</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
