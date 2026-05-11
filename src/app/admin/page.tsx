"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"pending" | "users" | "applications">("pending");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, session, tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = tab === "pending" ? "/api/admin/pending" : tab === "users" ? "/api/admin/users" : "/api/admin/applications";
      const res = await fetch(endpoint);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAction = async (type: string, id: string, action: string) => {
    setSubmitting(id);
    try {
      await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, action }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
    setSubmitting(null);
  };

  const handleUserUpdate = async (userId: string, updates: any) => {
    setSubmitting(userId);
    try {
      await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
    setSubmitting(null);
  };

  if (status === "loading" || loading) return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Loading Admin Tools...</div>;

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px" }}>Admin Panel</h1>
        <p style={{ color: "var(--text-secondary)" }}>Platform oversight and content moderation.</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "32px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
        {[
          { id: "pending", label: "Pending Uploads" },
          { id: "users", label: "User Management" },
          { id: "applications", label: "Verification Apps" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            style={{
              padding: "10px 20px", borderRadius: "10px",
              background: tab === t.id ? "rgba(255,255,255,0.05)" : "transparent",
              color: tab === t.id ? "var(--primary)" : "var(--text-secondary)",
              border: tab === t.id ? "1px solid var(--border)" : "1px solid transparent",
              fontWeight: 600, fontSize: "0.9rem"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pending" && (
        <div style={{ display: "grid", gap: "32px" }}>
          {["resources", "servers", "communities"].map(type => (
            <div key={type}>
              <h2 style={{ fontSize: "1.2rem", textTransform: "capitalize", marginBottom: "20px", color: "var(--text-muted)" }}>{type}</h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {data?.[type]?.map((item: any) => (
                  <div key={item.id} className="featureCard" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.title || item.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>by {item.author?.name || "System"} • {new Date(item.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => handleAction(type, item.id, "APPROVE")} disabled={!!submitting} className="btnPrimary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>Approve</button>
                      <button onClick={() => handleAction(type, item.id, "REJECT")} disabled={!!submitting} className="btnOutline" style={{ padding: "8px 16px", fontSize: "0.85rem", borderColor: "#ef4444", color: "#ef4444" }}>Reject</button>
                    </div>
                  </div>
                ))}
                {(!data?.[type] || data[type].length === 0) && <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No pending {type}.</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="featureCard" style={{ padding: "0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "16px" }}>User</th>
                <th style={{ padding: "16px" }}>Email</th>
                <th style={{ padding: "16px" }}>Role</th>
                <th style={{ padding: "16px" }}>Status</th>
                <th style={{ padding: "16px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((u: any) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "16px", fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: "16px", color: "var(--text-secondary)" }}>{u.email}</td>
                  <td style={{ padding: "16px" }}>
                    <select 
                      value={u.role} 
                      onChange={(e) => handleUserUpdate(u.id, { role: e.target.value })}
                      style={{ background: "#0a0a0a", color: "white", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px" }}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td style={{ padding: "16px" }}>
                    {u.isVerified ? <span style={{ color: "#22c55e" }}>Verified</span> : <span style={{ color: "var(--text-muted)" }}>Standard</span>}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <button 
                      onClick={() => handleUserUpdate(u.id, { isVerified: !u.isVerified })}
                      style={{ fontSize: "0.8rem", color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      {u.isVerified ? "Revoke Verification" : "Verify User"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "applications" && (
        <div style={{ display: "grid", gap: "16px" }}>
          {data?.map((app: any) => (
            <div key={app.id} className="featureCard" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>{app.user?.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{app.user?.email}</div>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(app.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", marginBottom: "20px", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {app.message}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => handleUserUpdate(app.user.id, { isVerified: true })} className="btnPrimary" style={{ padding: "8px 20px" }}>Approve & Verify</button>
                <button className="btnOutline" style={{ padding: "8px 20px", color: "#ef4444", borderColor: "#ef4444" }}>Decline</button>
              </div>
            </div>
          ))}
          {data?.length === 0 && <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>No pending verification applications.</p>}
        </div>
      )}
    </div>
  );
}
