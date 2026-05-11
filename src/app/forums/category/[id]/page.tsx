"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CategoryPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/forums/categories/${params.id}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Loading Threads...</div>;

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
        <div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>
            <Link href="/forums">Forums</Link> / {data?.category?.name}
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>{data?.category?.name}</h1>
        </div>
        {session && <button className="btnPrimary">New Thread</button>}
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {data?.threads?.map((thread: any) => (
          <Link key={thread.id} href={`/forums/thread/${thread.id}`} style={{ textDecoration: "none" }}>
            <div className="featureCard" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "4px", color: "var(--text)" }}>
                  {thread.isPinned && "📌 "}{thread.title}
                </h3>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  by {thread.author?.name} • {new Date(thread.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign: "right", minWidth: "100px" }}>
                <div style={{ fontWeight: 600 }}>{thread._count?.posts || 0}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Replies</div>
              </div>
            </div>
          </Link>
        ))}
        {data?.threads?.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px dashed var(--border)" }}>
            <p style={{ color: "var(--text-muted)" }}>No threads in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
