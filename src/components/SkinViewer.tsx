"use client";

import { useEffect, useRef, useState } from "react";
import { SkinViewer as Skinview3d, WalkingAnimation } from "skinview3d";

export function SkinViewer({ gamertag }: { gamertag: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!gamertag || !canvasRef.current) return;

    let viewer: Skinview3d | null = null;

    const loadSkin = async () => {
      try {
        const xuidRes = await fetch(`https://api.geysermc.org/v2/xbox/xuid/${encodeURIComponent(gamertag)}`);
        if (!xuidRes.ok) throw new Error("Failed to get XUID");
        const xuidData = await xuidRes.json();
        const xuid = xuidData.xuid;

        const skinUrl = `https://api.geysermc.org/v2/skin/${xuid}`;

        viewer = new Skinview3d({
          canvas: canvasRef.current!,
          width: 250,
          height: 350,
          skin: skinUrl
        });

        viewer.animation = new WalkingAnimation();
        viewer.autoRotate = true;
        viewer.autoRotateSpeed = 0.5;

      } catch (err) {
        console.error("Skin loading error:", err);
        setError(true);
      }
    };

    loadSkin();

    return () => {
      if (viewer) {
        viewer.dispose();
      }
    };
  }, [gamertag]);

  if (error) return null; // Fallback handled by parent if null

  return (
    <div style={{ position: "relative", width: 250, height: 350, margin: "0 auto" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", outline: "none" }} />
      <div style={{ position: "absolute", bottom: -20, left: 0, right: 0, textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
        Live 3D Preview
      </div>
    </div>
  );
}
