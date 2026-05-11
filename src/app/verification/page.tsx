"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (status === "unauthenticated") {
    router.push("/auth/signin");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      
      if (res.ok) {
        setResult("Application submitted! We will review your profile soon.");
      } else {
        const data = await res.json();
        setResult(data.error || "Failed to submit application.");
      }
    } catch (error) {
      setResult("Error submitting application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "16px" }}>Creator Verification</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Get recognized as a trusted creator with the verified badge.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Benefits</h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {[
                { title: "Trust Badge", desc: "A blue checkmark next to your name." },
                { title: "Priority Support", desc: "Faster approval for your resources." },
                { title: "Featured Content", desc: "Increased chance of being featured on the homepage." },
                { title: "Custom URL", desc: "Unlock a custom profile link (e.g., bedrockhub.com/creators/you)." },
              ].map(b => (
                <div key={b.title} style={{ padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 600, color: "var(--primary)", marginBottom: "4px" }}>{b.title}</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="featureCard" style={{ padding: "32px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Apply Now</h2>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label className="formLabel">Why should we verify you?</label>
                <textarea 
                  className="formInput" 
                  rows={6}
                  placeholder="Tell us about your creations, other platforms where you upload (MCPEDL, BuiltByBit, etc.), and your community presence."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{ resize: "none" }}
                />
              </div>
              <button 
                type="submit" 
                className="btnPrimary" 
                style={{ width: "100%" }}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
              {result && (
                <div style={{ 
                  marginTop: "20px", padding: "12px", borderRadius: "8px", 
                  background: result.includes("submitted") ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  color: result.includes("submitted") ? "#22c55e" : "#ef4444",
                  fontSize: "0.9rem", textAlign: "center"
                }}>
                  {result}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
