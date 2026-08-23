// src/services/itemsApi.js

// URL fixa do back-end hosteado (Railway)
const BASE_URL = "https://backendtcc-production-ec04.up.railway.app/api";

// Função utilitária para requisições
async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const headers = isFormData
    ? {}
    : {
        "Content-Type": "application/json",
      };

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers,
      credentials: "include", // mantém cookie JWT
      ...options,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Erro HTTP ${res.status}`);
    }

    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    console.error(`[API ERRO em ${path}]`, err);
    throw err;
  }
}

// ─────────────────────────────────────
// CRUD de Itens (com suporte a filtros)
// ─────────────────────────────────────
export function getItems(filters = {}) {
  const query = new URLSearchParams();

  if (filters.category) query.append("categoria", filters.category);
  if (filters.tipo) query.append("tipo", filters.tipo);
  if (filters.location) query.append("location_id", filters.location);
  if (filters.reception) query.append("reception_id", filters.reception);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return request(`/items${qs}`);
}

export function getItem(id) {
  return request(`/items/${id}`);
}

export function createItem(data) {
  const isForm = data instanceof FormData;
  const body = isForm ? data : JSON.stringify(data);

  return request("/items", {
    method: "POST",
    body,
  });
}

export function updateItem(id, data) {
  const isForm = data instanceof FormData;
  const body = isForm ? data : JSON.stringify(data);

  return request(`/items/${id}`, {
    method: "PUT",
    body,
  });
}

export function deleteItem(id) {
  return request(`/items/${id}`, {
    method: "DELETE",
  });
}

// ─────────────────────────────────────
// Rotas auxiliares
// ─────────────────────────────────────
export function getLocations() {
  return request("/locations");
}

export function getReceptions() {
  return request("/receptions");
}
