"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ServerProps {
  server: {
    id: string;
    name: string;
    description: string;
    ip: string;
    port: number;
    thumbnail: string | null;
    likeCount: number;
  };
}

export function ServerCard({ server }: ServerProps) {
  const [players, setPlayers] = useState<number | null>(null);
  const [maxPlayers, setMaxPlayers] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`https://api.mcsrvstat.us/bedrock/3/${server.ip}:${server.port}`)
      .then(res => res.json())
      .then(data => {
        if (data.online) {
          setIsOnline(true);
          setPlayers(data.players?.online || 0);
          setMaxPlayers(data.players?.max || 0);
        } else {
          setIsOnline(false);
        }
      })
      .catch(() => setIsOnline(false));
  }, [server.ip, server.port]);

  return (
    <div style={{
      padding: "20px",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.02)",
      backdropFilter: "blur(20px)",
      transition: "all var(--transition)",
    }}>
      {server.thumbnail && (
        <div style={{ position: "relative", width: "100%", height: "160px", marginBottom: "16px", borderRadius: "8px", overflow: "hidden" }}>
          <Image src={server.thumbnail} alt="" fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: "cover" }} />
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{server.name}</div>
        {isOnline !== null && (
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "0.8rem", fontWeight: 600,
            color: isOnline ? "#22c55e" : "#ef4444",
            background: isOnline ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
            padding: "4px 8px", borderRadius: "9999px"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", boxShadow: `0 0 8px currentColor` }} />
            {isOnline ? `${players}/${maxPlayers}` : "Offline"}
          </div>
        )}
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "16px", lineHeight: 1.5 }}>{server.description}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg>
          {server.likeCount || 0}
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "monospace", background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "6px" }}>
          {server.ip}:{server.port}
        </div>
      </div>
    </div>
  );
}
