"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/dashboard");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Loading Dashboard...</div>;
  }

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px" }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage your creations and community activity.</p>
        </div>
        <Link href="/upload" className="btnPrimary">New Upload</Link>
      </div>

      <div style={{ display: "flex", gap: "32px" }}>
        {/* Sidebar Nav */}
        <div style={{ width: "240px", flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "uploads", label: "My Uploads", icon: "📦" },
              { id: "favorites", label: "Favorites", icon: "❤️" },
              { id: "reviews", label: "My Reviews", icon: "⭐" },
              { id: "settings", label: "Settings", icon: "⚙️" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
                  borderRadius: "12px", fontSize: "0.95rem", fontWeight: 500, textAlign: "left",
                  background: activeTab === tab.id ? "rgba(255,255,255,0.05)" : "transparent",
                  color: activeTab === tab.id ? "var(--primary)" : "var(--text-secondary)",
                  border: activeTab === tab.id ? "1px solid var(--border)" : "1px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flexGrow: 1 }}>
          {activeTab === "overview" && (
            <div style={{ display: "grid", gap: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                <div className="featureCard" style={{ padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800 }}>{data?.stats?.totalDownloads || 0}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Downloads</div>
                </div>
                <div className="featureCard" style={{ padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800 }}>{data?.stats?.totalViews || 0}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Profile Views</div>
                </div>
                <div className="featureCard" style={{ padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800 }}>{data?.stats?.avgRating?.toFixed(1) || "N/A"}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Avg Rating</div>
                </div>
              </div>

              <div className="featureCard" style={{ padding: "32px" }}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "20px" }}>Recent Activity</h2>
                {data?.activity?.length > 0 ? (
                  <div style={{ display: "grid", gap: "16px" }}>
                    {/* Activity List */}
                  </div>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No recent activity to show.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "uploads" && (
            <div style={{ display: "grid", gap: "16px" }}>
              {data?.uploads?.map((item: any) => (
                <div key={item.id} className="featureCard" style={{ display: "flex", gap: "20px", alignItems: "center", padding: "16px" }}>
                  <div style={{ width: "100px", height: "60px", borderRadius: "8px", background: `url(${item.thumbnail || '/placeholder.png'}) center/cover`, border: "1px solid var(--border)" }} />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.category} • {item.downloads} downloads</div>
                  </div>
                  <div style={{ 
                    padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700,
                    background: item.status === "APPROVED" ? "rgba(34, 197, 94, 0.1)" : item.status === "PENDING" ? "rgba(234, 179, 8, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    color: item.status === "APPROVED" ? "#22c55e" : item.status === "PENDING" ? "#eab308" : "#ef4444",
                    border: "1px solid currentColor"
                  }}>
                    {item.status}
                  </div>
                  <Link href={`/resource/${item.id}/edit`} style={{ padding: "8px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", fontSize: "0.85rem" }}>Edit</Link>
                </div>
              ))}
              {data?.uploads?.length === 0 && (
                <div style={{ padding: "60px", textAlign: "center", background: "var(--bg-card)", borderRadius: "24px", border: "1px dashed var(--border)" }}>
                  <p style={{ color: "var(--text-muted)" }}>You haven't uploaded anything yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Other tabs follow similar pattern */}
        </div>
      </div>
    </div>
  );
}
