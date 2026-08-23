// src/services/authApi.js
const BASE_URL = "https://backendtcc-production-ec04.up.railway.app/api";

/* ─────────────── AUTENTICAÇÃO ─────────────── */

export async function login({ username, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Falha na autenticação");
  return data;
}

export async function me() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Sessão inválida");
  return res.json();
}

export async function logout() {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

/* ─────────────── CRUD DE USUÁRIOS ─────────────── */

// Listar usuários
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/auth/users`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao carregar usuários");
  return res.json();
}

// Criar usuário
export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/auth/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar usuário");
  return res.json();
}

// Atualizar usuário
export async function updateUser(id, data) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar usuário");
  return res.json();
}

// Atualizar senha
export async function updatePassword(id, password) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar senha");
  return res.json();
}

// Excluir usuário
export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao excluir usuário");
  return res.json();
}
