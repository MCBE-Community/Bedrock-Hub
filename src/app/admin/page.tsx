"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resources");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchPending();
    }
  }, [status, session]);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pending");
      const data = await res.json();
      setPending(data);
    } catch (error) {
      console.error("Error fetching pending:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, type: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, action }),
      });
      if (res.ok) {
        fetchPending(); // Refresh
      }
    } catch (error) {
      console.error("Action error:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
        <p style={{ marginTop: "20px", color: "var(--text-secondary)" }}>Loading Dashboard...</p>
      </div>
    );
  }

  const currentList = pending ? pending[activeTab] : [];

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px" }}>Admin Dashboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Review and moderate community submissions.</p>
      </div>

      <div className="filterRow" style={{ marginBottom: "32px" }}>
        <button 
          className="filterBtn" 
          style={activeTab === "resources" ? { backgroundColor: "var(--primary)", color: "var(--bg)" } : {}}
          onClick={() => setActiveTab("resources")}
        >
          Resources ({pending?.resources?.length || 0})
        </button>
        <button 
          className="filterBtn" 
          style={activeTab === "servers" ? { backgroundColor: "var(--primary)", color: "var(--bg)" } : {}}
          onClick={() => setActiveTab("servers")}
        >
          Servers ({pending?.servers?.length || 0})
        </button>
        <button 
          className="filterBtn" 
          style={activeTab === "communities" ? { backgroundColor: "var(--primary)", color: "var(--bg)" } : {}}
          onClick={() => setActiveTab("communities")}
        >
          Communities ({pending?.communities?.length || 0})
        </button>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {currentList.length === 0 ? (
          <div style={{ 
            padding: "60px", textAlign: "center", background: "var(--bg-card)", 
            border: "1px solid var(--border)", borderRadius: "24px", color: "var(--text-muted)" 
          }}>
            No pending {activeTab} at the moment.
          </div>
        ) : (
          currentList.map((item: any) => (
            <div key={item.id} className="featureCard" style={{ display: "flex", gap: "24px", alignItems: "center", padding: "24px" }}>
              <div style={{ 
                width: "120px", height: "80px", borderRadius: "12px", 
                background: `url(${item.thumbnail || '/placeholder.png'}) center/cover`,
                border: "1px solid var(--border)"
              }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{item.name || item.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px", display: "flex", gap: "12px" }}>
                  <span>Author: {item.author?.name || "Unknown"}</span>
                  <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                  {item.category && <span>Category: {item.category}</span>}
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button 
                    onClick={() => handleAction(item.id, activeTab.slice(0, -1), "APPROVE")}
                    style={{ padding: "8px 20px", background: "#22c55e", color: "#000", fontWeight: 600, borderRadius: "9999px", fontSize: "0.85rem" }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(item.id, activeTab.slice(0, -1), "REJECT")}
                    style={{ padding: "8px 20px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#ef4444", fontWeight: 600, borderRadius: "9999px", fontSize: "0.85rem" }}
                  >
                    Reject
                  </button>
                  <a 
                    href={item.category ? `/resource/${item.id}` : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ padding: "8px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "9999px", fontSize: "0.85rem" }}
                  >
                    Preview
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
