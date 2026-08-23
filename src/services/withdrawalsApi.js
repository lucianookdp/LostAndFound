// src/services/withdrawalsApi.js

// URL fixa do back-end hosteado (Railway)
const BASE_URL = "https://backendtcc-production-ec04.up.railway.app/api";

// Função utilitária para requisições
async function request(path, options = {}) {
  const headers =
    options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" };

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    credentials: "include", // garante envio de cookies JWT
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `Erro HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) errorMsg = data.error;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ─────────────────────────────────────
// API de Retiradas / Relatórios
// ─────────────────────────────────────

/**
 * Listar todas as retiradas com filtros opcionais
 * @param {object} filters - { category, tipo, reception, funcionario, startDate, endDate }
 */
export function getWithdrawals(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) params.append("categoria", filters.category);
  if (filters.tipo) params.append("tipo", filters.tipo);
  if (filters.reception) params.append("reception", filters.reception);
  if (filters.funcionario) params.append("funcionario", filters.funcionario);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);

  const query = params.toString();
  const url = `/withdrawals${query ? `?${query}` : ""}`;

  return request(url);
}

// Obter retirada por ID
export function getWithdrawal(id) {
  return request(`/withdrawals/${id}`);
}

// Registrar retirada (gera log)
export function createWithdrawal(data) {
  return request("/withdrawals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Excluir retirada (apenas admin)
export function deleteWithdrawal(id) {
  return request(`/withdrawals/${id}`, {
    method: "DELETE",
  });
}

/**
 * Gerar PDF filtrado
 * @param {string} periodo - "diario" | "semanal" | "mensal" | "anual" | undefined
 * @param {object} options - parâmetros extras { mes, ano }
 */
export async function downloadWithdrawalsReport(periodo, options = {}) {
  let url = `${BASE_URL}/withdrawals-report/pdf`;

  if (periodo) {
    const params = new URLSearchParams({ periodo });
    if (periodo === "mensal" || periodo === "anual") {
      if (options.mes) params.append("mes", options.mes);
      if (options.ano) params.append("ano", options.ano);
    }
    url += `?${params.toString()}`;
  }

  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) {
    let errorMsg = "Erro ao gerar relatório PDF";
    try {
      const data = await res.json();
      if (data?.error) errorMsg = data.error;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }

  // Cria blob e dispara download
  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = `relatorio_${periodo || "geral"}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
}
