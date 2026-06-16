"use client";

import { useEffect, useState } from "react";
import Editor from "./Editor";

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authed)))
      .catch(() => setAuthed(false));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password");
        return;
      }
      setAuthed(true);
      setPassword("");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  if (authed === null) {
    return <div className="grid min-h-screen place-items-center text-[#4a3428]">Loading…</div>;
  }

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#faf7f2] px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-[#e0d3c4] bg-white p-6">
          <h1 className="mb-4 text-xl font-bold text-[#2d1810]">Rangved Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-3 w-full rounded-lg border border-[#e0d3c4] px-3 py-2"
            autoFocus
          />
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-full bg-[#e07b39] px-4 py-2.5 font-semibold text-white disabled:opacity-40"
          >
            {busy ? "Checking…" : "Log in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Editor onLogout={logout} />
    </div>
  );
}
