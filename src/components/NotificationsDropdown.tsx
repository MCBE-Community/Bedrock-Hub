"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/user/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch("/api/user/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read" }),
      });
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.isRead) {
      try {
        await fetch("/api/user/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "mark_one_read", id: notif.id }),
        });
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (e) {}
    }
    setOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && unreadCount > 0) markAllRead();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
          cursor: "pointer",
          transition: "all var(--transition)",
          position: "relative"
        }}
        aria-label="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -2, right: -2, background: "#ef4444", color: "#fff",
            fontSize: "0.65rem", fontWeight: 700, width: 16, height: 16, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 2px var(--bg)"
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
          border: "1px solid var(--border)", borderRadius: "16px", minWidth: "320px", maxWidth: "400px", zIndex: 200,
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)", overflow: "hidden", display: "flex", flexDirection: "column"
        }}>
          <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 500 }}>
                Mark all read
              </button>
            )}
          </div>
          
          <div style={{ maxHeight: "360px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {loading ? (
              <div style={{ padding: "32px", textAlign: "center" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid var(--border)", borderTopColor: "var(--primary)", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: "16px", borderBottom: "1px solid var(--border)", background: notif.isRead ? "transparent" : "rgba(255,255,255,0.03)",
                    cursor: notif.link ? "pointer" : "default", transition: "background 0.2s",
                    display: "grid", gap: "4px"
                  }}
                  onMouseEnter={e => { if (notif.link) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                  onMouseLeave={e => { if (notif.link) e.currentTarget.style.background = notif.isRead ? "transparent" : "rgba(255,255,255,0.03)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <strong style={{ fontSize: "0.9rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      {!notif.isRead && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />}
                      {notif.type.replace(/_/g, ' ')}
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                    {notif.message}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                No notifications yet.
              </div>
            )}
          </div>
          
          <Link href="/settings/notifications" onClick={() => setOpen(false)} style={{
            display: "block", padding: "12px", textAlign: "center", fontSize: "0.85rem", 
            color: "var(--text-secondary)", borderTop: "1px solid var(--border)", background: "rgba(0,0,0,0.2)"
          }}>
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
