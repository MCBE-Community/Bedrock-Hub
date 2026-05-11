"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ThreadPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchThread();
  }, [params.id]);

  const fetchThread = async () => {
    const res = await fetch(`/api/forums/threads/${params.id}`);
    setData(await res.json());
    setLoading(false);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/forums/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: reply, threadId: params.id }),
      });
      setReply("");
      fetchThread();
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Loading Thread...</div>;

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>
          <Link href="/forums">Forums</Link> / <Link href={`/forums/category/${data?.thread?.categoryId}`}>{data?.thread?.category?.name}</Link>
        </div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800 }}>{data?.thread?.title}</h1>
      </div>

      <div style={{ display: "grid", gap: "24px" }}>
        {/* Original Post */}
        <div className="featureCard" style={{ padding: "32px", borderLeft: "4px solid var(--primary)" }}>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)" }} />
            <div>
              <div style={{ fontWeight: 700 }}>{data?.thread?.author?.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{new Date(data?.thread?.createdAt).toLocaleString()}</div>
            </div>
          </div>
          <div style={{ lineHeight: 1.8, fontSize: "1.05rem", color: "var(--text-secondary)" }}>
            {data?.thread?.content}
          </div>
        </div>

        {/* Replies */}
        {data?.thread?.posts?.map((post: any) => (
          <div key={post.id} className="featureCard" style={{ padding: "24px" }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }} />
              <div>
                <div style={{ fontWeight: 600 }}>{post.author?.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(post.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div style={{ lineHeight: 1.7, color: "var(--text-secondary)" }}>{post.content}</div>
          </div>
        ))}

        {/* Reply Form */}
        {session ? (
          <form onSubmit={handleReply} style={{ marginTop: "40px" }}>
            <h3 style={{ marginBottom: "16px" }}>Post a Reply</h3>
            <textarea 
              className="formInput" 
              rows={5} 
              value={reply} 
              onChange={e => setReply(e.target.value)}
              placeholder="Join the discussion..."
              style={{ resize: "none", marginBottom: "16px" }}
              required
            />
            <button type="submit" className="btnPrimary" disabled={submitting}>
              {submitting ? "Posting..." : "Submit Reply"}
            </button>
          </form>
        ) : (
          <div style={{ marginTop: "40px", textAlign: "center", padding: "32px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px dashed var(--border)" }}>
            <p style={{ color: "var(--text-muted)" }}>You must be <Link href="/auth/signin" style={{ color: "var(--primary)" }}>logged in</Link> to reply.</p>
          </div>
        )}
      </div>
    </div>
  );
}
