"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "TexturePack",
    resolution: "16x",
    tags: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--primary)", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "40px 24px",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "28px", color: "var(--text-secondary)"
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "16px" }}>
          Sign In Required
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: "32px", maxWidth: "400px" }}>
          You need to be connected with Discord to upload resources to the platform.
        </p>
        <button onClick={() => signIn("discord")} className="btnPrimary" style={{ padding: "14px 36px", fontSize: "1rem" }}>
          Connect with Discord
        </button>
      </div>
    );
  }

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).slice(0, 5);
    setImages(newImages);

    const previews: string[] = [];
    newImages.forEach((img) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === newImages.length) {
          setImagePreviews([...previews]);
        }
      };
      reader.readAsDataURL(img);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("You must select a file to upload.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("category", formData.type);
      fd.append("resolution", formData.resolution);
      fd.append("tags", formData.tags);
      fd.append("file", file);
      images.forEach((img) => fd.append("images", img));

      const res = await fetch("/api/resources/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to upload resource.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ paddingBottom: "100px", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px", color: "#22c55e",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "12px" }}>
          Resource Uploaded!
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "1.05rem" }}>
          Your resource has been submitted and will be published shortly.
        </p>
        <Link href="/search" className="btnPrimary">Browse Resources</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: "100px", maxWidth: "720px" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>
        Upload Resource
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "48px", fontSize: "1.05rem" }}>
        Share your creation with the Bedrock community.
      </p>

      {error && (
        <div style={{
          padding: "14px 20px", marginBottom: "24px",
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "12px", color: "#ef4444", fontSize: "0.9rem",
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label className="formLabel">Title *</label>
          <input className="formInput" type="text" placeholder="E.g. Clean PvP 16x" required
            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="formGroup">
            <label className="formLabel">Type *</label>
            <select className="formSelect" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <option value="TexturePack">Texture Pack</option>
              <option value="Addon">Addon</option>
              <option value="Map">Map</option>
              <option value="Skin">Skin Pack</option>
              <option value="Shader">Shader</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="formLabel">Resolution</label>
            <select className="formSelect" value={formData.resolution} onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}>
              <option value="16x">16x</option>
              <option value="32x">32x</option>
              <option value="64x">64x</option>
              <option value="128x">128x</option>
              <option value="256x">256x</option>
            </select>
          </div>
        </div>

        <div className="formGroup">
          <label className="formLabel">Description *</label>
          <textarea className="formTextarea" placeholder="Describe your resource..." required
            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>

        <div className="formGroup">
          <label className="formLabel">Tags</label>
          <input className="formInput" type="text" placeholder="PvP, Bedwars, FPS Boost (comma separated)"
            value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
        </div>

        <div className="formGroup">
          <label className="formLabel">File (.mcpack, .mcaddon, .zip) *</label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? "var(--primary)" : "var(--border)"}`,
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              background: dragActive ? "rgba(255,255,255,0.03)" : "transparent",
            }}
          >
            {file ? (
              <div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: "12px", color: "var(--primary)" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>{file.name}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ) : (
              <div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: "12px", color: "var(--text-muted)" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  Drag & drop your file here or click to browse
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "8px" }}>
                  .mcpack, .mcaddon, .zip — Max 50MB
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".mcpack,.mcaddon,.zip"
              style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        </div>

        <div className="formGroup">
          <label className="formLabel">Screenshots (up to 5)</label>
          <div
            onClick={() => imgRef.current?.click()}
            style={{
              border: "2px dashed var(--border)",
              borderRadius: "16px",
              padding: imagePreviews.length > 0 ? "16px" : "40px 24px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            {imagePreviews.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px" }}>
                {imagePreviews.map((src, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "16/10" }}>
                    <img src={src} alt={`Preview ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      style={{
                        position: "absolute", top: "6px", right: "6px",
                        width: 24, height: 24, borderRadius: "50%",
                        background: "rgba(0,0,0,0.7)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.7rem", cursor: "pointer",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                  </div>
                ))}
                {imagePreviews.length < 5 && (
                  <div style={{
                    borderRadius: "10px", border: "1px dashed var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    aspectRatio: "16/10", color: "var(--text-muted)"
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: "12px", color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  Add screenshots to showcase your resource
                </div>
              </div>
            )}
            <input ref={imgRef} type="file" accept="image/png,image/jpeg,image/webp" multiple
              style={{ display: "none" }} onChange={(e) => handleImageSelect(e.target.files)} />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btnPrimary" style={{ width: "100%", padding: "16px", fontSize: "1.05rem", opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? "Uploading..." : "Publish Resource"}
        </button>
      </form>
    </div>
  );
}
