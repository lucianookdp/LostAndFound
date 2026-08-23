// services/locaisApi.js

// URL fixa do back-end hosteado (Railway)
const BASE_URL = "https://backendtcc-production-ec04.up.railway.app/api";

// ─────────────────────────────────────
// LOCATIONS
// ─────────────────────────────────────

export async function getLocations() {
  const res = await fetch(`${BASE_URL}/locations`, { credentials: "include" });
  if (!res.ok) throw new Error("Erro ao buscar locais");
  return res.json();
}

export async function createLocation(data) {
  const res = await fetch(`${BASE_URL}/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar local");
  return res.json();
}

export async function updateLocation(id, data) {
  const res = await fetch(`${BASE_URL}/locations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar local");
  return res.json();
}

export async function deleteLocation(id) {
  const res = await fetch(`${BASE_URL}/locations/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao excluir local");
  return true;
}

// ─────────────────────────────────────
// RECEPTIONS
// ─────────────────────────────────────

export async function getReceptions() {
  const res = await fetch(`${BASE_URL}/receptions`, { credentials: "include" });
  if (!res.ok) throw new Error("Erro ao buscar recepções");
  return res.json();
}

export async function createReception(data) {
  const res = await fetch(`${BASE_URL}/receptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar recepção");
  return res.json();
}

export async function updateReception(id, data) {
  const res = await fetch(`${BASE_URL}/receptions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar recepção");
  return res.json();
}

export async function deleteReception(id) {
  const res = await fetch(`${BASE_URL}/receptions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao excluir recepção");
  return true;
}
