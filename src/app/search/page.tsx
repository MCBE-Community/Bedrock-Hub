"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

const typeOptions = ["All", "TexturePack", "Addon", "Map", "Shader", "Skin"];
const tagOptions = ["All", "PvP", "Original", "Aesthetic", "FPS Boost", "Bedwars", "Crystal", "Anime", "Shaders", "Survival", "Sky", "Skyblock"];
const resOptions = ["All", "16x", "32x", "64x", "128x", "256x"];
const sortOptions = [
  { label: "Most Recent", value: "recent" },
  { label: "Most Popular", value: "popular" },
  { label: "A-Z", value: "az" },
];

export default function SearchPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [resFilter, setResFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/resources")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResources(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let results = [...resources];

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(r =>
        r.title.toLowerCase().includes(q) ||
        (r.author?.name || "").toLowerCase().includes(q) ||
        (r.tags || "").toLowerCase().includes(q)
      );
    }

    if (typeFilter !== "All") results = results.filter(r => r.category === typeFilter);
    if (tagFilter !== "All") results = results.filter(r => (r.tags || "").includes(tagFilter));
    if (resFilter !== "All") results = results.filter(r => r.resolution === resFilter);

    if (sortBy === "popular") results.sort((a, b) => b.downloads - a.downloads);
    else if (sortBy === "az") results.sort((a, b) => a.title.localeCompare(b.title));

    return results;
  }, [resources, query, typeFilter, tagFilter, resFilter, sortBy]);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const DropdownBtn = ({ id, label, options, value, onChange }: {
    id: string; label: string; options: string[]; value: string;
    onChange: (v: string) => void;
  }) => (
    <div style={{ position: "relative" }}>
      <button
        className="filterBtn"
        onClick={() => toggleDropdown(id)}
        style={{
          borderColor: value !== options[0] ? "var(--primary)" : undefined,
          color: value !== options[0] ? "var(--primary)" : undefined,
        }}
      >
        {value === options[0] ? label : value} 
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4 }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {openDropdown === id && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
          border: "1px solid var(--border)", borderRadius: "12px",
          padding: "6px", minWidth: "180px", zIndex: 50,
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpenDropdown(null); }}
              style={{
                display: "block", width: "100%", padding: "10px 14px",
                textAlign: "left", fontSize: "0.9rem", borderRadius: "8px",
                color: value === opt ? "var(--primary)" : "var(--text-secondary)",
                fontWeight: value === opt ? 600 : 400,
                background: value === opt ? "rgba(255,255,255,0.04)" : "transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={e => (e.currentTarget.style.background = value === opt ? "rgba(255,255,255,0.04)" : "transparent")}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container" style={{ paddingBottom: "100px" }} onClick={() => openDropdown && setOpenDropdown(null)}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "16px" }}>
          Browse Resources
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
          Find and download the best Texture Packs, Addons, Maps and more.
        </p>
      </div>

      <div className="searchWrap">
        <svg className="searchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          className="searchInput"
          placeholder="Search packs, tags, creators..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="filterRow" onClick={(e) => e.stopPropagation()}>
        <DropdownBtn id="type" label="All Types" options={typeOptions} value={typeFilter} onChange={setTypeFilter} />
        <DropdownBtn id="tag" label="All Tags" options={tagOptions} value={tagFilter} onChange={setTagFilter} />
        <DropdownBtn id="res" label="Any Resolution" options={resOptions} value={resFilter} onChange={setResFilter} />
        <div style={{ position: "relative" }}>
          <button className="filterBtn" onClick={() => toggleDropdown("sort")}>
            {sortOptions.find(s => s.value === sortBy)?.label}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4 }}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {openDropdown === "sort" && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0,
              background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
              border: "1px solid var(--border)", borderRadius: "12px",
              padding: "6px", minWidth: "180px", zIndex: 50,
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}>
              {sortOptions.map(opt => (
                <button key={opt.value}
                  onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                  style={{
                    display: "block", width: "100%", padding: "10px 14px",
                    textAlign: "left", fontSize: "0.9rem", borderRadius: "8px",
                    color: sortBy === opt.value ? "var(--primary)" : "var(--text-secondary)",
                    fontWeight: sortBy === opt.value ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {(typeFilter !== "All" || tagFilter !== "All" || resFilter !== "All") && (
          <button
            onClick={() => { setTypeFilter("All"); setTagFilter("All"); setResFilter("All"); }}
            style={{
              padding: "10px 16px", borderRadius: "9999px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div style={{ marginBottom: "24px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--primary)", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        </div>
      ) : filtered.length > 0 ? (
        <div className="gridResources">
          {filtered.map((pack) => {
            const displayTag = pack.tags ? pack.tags.split(',')[0] : "Resource";
            const imageUrl = pack.thumbnails ? pack.thumbnails.split(',')[0] : null;
            return (
              <Link key={pack.id} href={`/resource/${pack.id}`} style={{ textDecoration: "none" }}>
                <div className="resourceCard">
                  <div className="cardImageWrap">
                    {imageUrl ? (
                      <img src={imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                    )}
                    {pack.resolution && <div className="cardBadge">{pack.resolution}</div>}
                  </div>
                  <div className="cardBody">
                    <div className="cardTitle">{pack.title}</div>
                    <div className="cardAuthor">by {pack.author?.name || "Unknown"}</div>
                    <div className="cardFooter">
                      <div className="cardDownloads">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        {pack.downloads.toLocaleString()}
                      </div>
                      <div className="cardTag">{displayTag}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" style={{ margin: "0 auto 16px" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <div style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
            No resources found.
          </div>
        </div>
      )}
    </div>
  );
}
