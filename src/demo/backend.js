// ── src/demo/backend.js
// Backend falso da demo: intercepta fetch() e responde às mesmas rotas que a
// API real respondia, lendo e gravando em memória. Nada sai do navegador e
// tudo volta ao estado inicial quando a página é recarregada.
//
// O código das telas e dos services não foi alterado: continua chamando
// /api/items, /api/withdrawals etc. exatamente como chamava o back-end.

import * as seed from "./seed";
import { relatorioPdf } from "./pdf";

const db = {
  items: structuredClone(seed.items),
  locations: structuredClone(seed.locations),
  receptions: structuredClone(seed.receptions),
  users: structuredClone(seed.users),
  withdrawals: structuredClone(seed.withdrawals),
};

let session = null;
const nextId = (list) => list.reduce((max, r) => Math.max(max, r.id), 0) + 1;
const json = (body, status = 200) =>
  new Response(JSON.stringify(body ?? null), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Usuário logado: a sessão em memória cai num F5, o sessionStorage sobrevive.
function currentUser() {
  if (session) return session;
  try {
    const raw = sessionStorage.getItem("auth_user");
    session = raw ? JSON.parse(raw) : null;
  } catch {
    session = null;
  }
  return session;
}

function publicUser(u) {
  const { password, ...rest } = u;
  return {
    ...rest,
    reception_name: db.receptions.find((r) => r.id === u.reception_id)?.name || null,
  };
}

// Preenche os campos que o back-end devolvia via JOIN.
function hydrateItem(item) {
  return {
    ...item,
    location_name: db.locations.find((l) => l.id === item.location_id)?.name || null,
    reception_name: db.receptions.find((r) => r.id === item.reception_id)?.name || null,
  };
}

const mes = (isoDate) =>
  new Date(isoDate).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });

function contar(lista, chave) {
  const mapa = new Map();
  for (const r of lista) {
    const k = chave(r);
    if (k) mapa.set(k, (mapa.get(k) || 0) + 1);
  }
  return mapa;
}

function dashboard() {
  const total = db.items.length + db.withdrawals.length;
  const ultimosMeses = [...Array(8)].map((_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    return d;
  });

  return {
    disponiveis: db.items.length,
    devolvidos: db.withdrawals.length,
    total,
    areasMaisItens: [...contar(db.items, (i) => i.location_name)]
      .map(([local, quantidade]) => ({ local, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 6),
    itensPorCategoria: [...contar(db.items, (i) => i.categoria)].map(
      ([categoria, quantidade]) => ({ categoria, quantidade })
    ),
    itensPorRecepcao: [...contar(db.items, (i) => i.reception_name)].map(
      ([recepcao, quantidade]) => ({ recepcao, quantidade })
    ),
    itensPrioridade: [
      {
        tipo: "Prioritários",
        quantidade: db.items.filter((i) => i.tipo === "prioritario").length,
      },
      {
        tipo: "Comuns",
        quantidade: db.items.filter((i) => i.tipo !== "prioritario").length,
      },
    ],
    // mais recente primeiro: o gráfico inverte antes de desenhar
    devolucoesPorMes: ultimosMeses.map((d) => ({
      mes: mes(d),
      quantidade: db.withdrawals.filter((w) => mes(w.date) === mes(d)).length,
    })),
  };
}

const rotas = [
  // ── autenticação
  ["POST", /^\/auth\/login$/, (_m, body) => {
    const u = db.users.find(
      (x) => x.username === body.username && x.password === body.password
    );
    if (!u) return json({ error: "Usuário ou senha inválidos" }, 401);
    session = publicUser(u);
    return json({ user: session });
  }],
  ["GET", /^\/auth\/me$/, () => {
    const u = currentUser();
    return u ? json({ user: u }) : json({ error: "Sessão inválida" }, 401);
  }],
  ["POST", /^\/auth\/logout$/, () => {
    session = null;
    return json({ ok: true });
  }],

  // ── usuários
  ["GET", /^\/auth\/users$/, () => json(db.users.map(publicUser))],
  ["POST", /^\/auth\/users$/, (_m, body) => {
    if (db.users.some((u) => u.username === body.username))
      return json({ message: "Já existe um usuário com esse login" }, 409);
    const novo = { ...body, id: nextId(db.users), role: body.role || "func" };
    db.users.push(novo);
    return json(publicUser(novo), 201);
  }],
  ["PUT", /^\/auth\/users\/(\d+)\/password$/, (m, body) => {
    const u = db.users.find((x) => x.id === Number(m[1]));
    if (!u) return json({ message: "Usuário não encontrado" }, 404);
    u.password = body.password;
    return json(publicUser(u));
  }],
  ["PUT", /^\/auth\/users\/(\d+)$/, (m, body) => {
    const u = db.users.find((x) => x.id === Number(m[1]));
    if (!u) return json({ message: "Usuário não encontrado" }, 404);
    Object.assign(u, body, { reception_id: Number(body.reception_id) });
    return json(publicUser(u));
  }],
  ["DELETE", /^\/auth\/users\/(\d+)$/, (m) => {
    const id = Number(m[1]);
    const u = db.users.find((x) => x.id === id);
    if (!u) return json({ message: "Usuário não encontrado" }, 404);
    if (u.role === "admin")
      return json({ message: "Não é possível excluir o administrador." }, 409);
    if (db.withdrawals.some((w) => w.funcionario_username === u.username))
      return json(
        { message: "Não é possível excluir funcionário com retiradas registradas." },
        409
      );
    db.users = db.users.filter((x) => x.id !== id);
    return json({ ok: true });
  }],

  // ── itens
  ["GET", /^\/items$/, (_m, _b, q) => {
    let lista = db.items.map(hydrateItem);
    if (q.get("categoria")) lista = lista.filter((i) => i.categoria === q.get("categoria"));
    if (q.get("tipo")) lista = lista.filter((i) => i.tipo === q.get("tipo"));
    if (q.get("location_id"))
      lista = lista.filter((i) => i.location_id === Number(q.get("location_id")));
    if (q.get("reception_id"))
      lista = lista.filter((i) => i.reception_id === Number(q.get("reception_id")));
    return json(lista.sort((a, b) => new Date(b.data) - new Date(a.data)));
  }],
  ["GET", /^\/items\/(\d+)$/, (m) => {
    const item = db.items.find((i) => i.id === Number(m[1]));
    return item ? json(hydrateItem(item)) : json({ error: "Item não encontrado" }, 404);
  }],
  ["POST", /^\/items$/, (_m, body) => {
    const novo = {
      ...body,
      id: nextId(db.items),
      location_id: Number(body.location_id),
      reception_id: Number(body.reception_id),
      data: new Date(`${body.data}T12:00:00`).toISOString(),
    };
    db.items.unshift(novo);
    return json(hydrateItem(novo), 201);
  }],
  ["PUT", /^\/items\/(\d+)$/, (m, body) => {
    const item = db.items.find((i) => i.id === Number(m[1]));
    if (!item) return json({ error: "Item não encontrado" }, 404);
    Object.assign(item, body, {
      location_id: Number(body.location_id),
      reception_id: Number(body.reception_id),
      data: new Date(`${body.data}T12:00:00`).toISOString(),
    });
    return json(hydrateItem(item));
  }],
  ["DELETE", /^\/items\/(\d+)$/, (m) => {
    db.items = db.items.filter((i) => i.id !== Number(m[1]));
    return new Response(null, { status: 204 });
  }],

  // ── locais e recepções
  ["GET", /^\/locations$/, () => json(db.locations)],
  ["POST", /^\/locations$/, (_m, body) => {
    const novo = { id: nextId(db.locations), name: body.name };
    db.locations.push(novo);
    return json(novo, 201);
  }],
  ["PUT", /^\/locations\/(\d+)$/, (m, body) => {
    const l = db.locations.find((x) => x.id === Number(m[1]));
    if (!l) return json({ error: "Local não encontrado" }, 404);
    l.name = body.name;
    return json(l);
  }],
  ["DELETE", /^\/locations\/(\d+)$/, (m) => {
    const id = Number(m[1]);
    if (db.items.some((i) => i.location_id === id))
      return json({ error: "Local com itens vinculados" }, 409);
    db.locations = db.locations.filter((x) => x.id !== id);
    return json({ ok: true });
  }],

  ["GET", /^\/receptions$/, () => json(db.receptions)],
  ["POST", /^\/receptions$/, (_m, body) => {
    const nova = { id: nextId(db.receptions), name: body.name };
    db.receptions.push(nova);
    return json(nova, 201);
  }],
  ["PUT", /^\/receptions\/(\d+)$/, (m, body) => {
    const r = db.receptions.find((x) => x.id === Number(m[1]));
    if (!r) return json({ error: "Recepção não encontrada" }, 404);
    r.name = body.name;
    return json(r);
  }],
  ["DELETE", /^\/receptions\/(\d+)$/, (m) => {
    const id = Number(m[1]);
    if (db.items.some((i) => i.reception_id === id))
      return json({ error: "Recepção com itens vinculados" }, 409);
    db.receptions = db.receptions.filter((x) => x.id !== id);
    return json({ ok: true });
  }],

  // ── retiradas
  ["GET", /^\/withdrawals-report\/pdf$/, (_m, _b, q) =>
    new Response(relatorioPdf(filtrarRetiradas(q), q.get("periodo")), {
      headers: { "Content-Type": "application/pdf" },
    })],
  ["GET", /^\/withdrawals$/, (_m, _b, q) => json(filtrarRetiradas(q))],
  ["GET", /^\/withdrawals\/(\d+)$/, (m) => {
    const w = db.withdrawals.find((x) => x.id === Number(m[1]));
    return w ? json(w) : json({ error: "Retirada não encontrada" }, 404);
  }],
  ["POST", /^\/withdrawals$/, (_m, body) => {
    const item = db.items.find((i) => i.id === Number(body.item_id));
    if (!item) return json({ error: "Item não encontrado" }, 404);
    const agora = new Date();
    const registro = {
      id: nextId(db.withdrawals),
      item_id: item.id,
      item_nome: item.nome,
      categoria: item.categoria,
      tipo: item.tipo,
      location_name: hydrateItem(item).location_name,
      reception_id: item.reception_id,
      reception_name: hydrateItem(item).reception_name,
      nome: body.nome,
      cpf: body.cpf,
      telefone: body.telefone,
      pessoa_tipo: body.tipo,
      ra: body.ra,
      curso: body.curso,
      funcionario_username: currentUser()?.username || "—",
      date: agora.toISOString(),
      created_at: agora.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    db.withdrawals.unshift(registro);
    db.items = db.items.filter((i) => i.id !== item.id); // saiu do acervo
    return json(registro, 201);
  }],
  ["DELETE", /^\/withdrawals\/(\d+)$/, (m) => {
    db.withdrawals = db.withdrawals.filter((w) => w.id !== Number(m[1]));
    return new Response(null, { status: 204 });
  }],

  ["GET", /^\/dashboard$/, () => json(dashboard())],
];

function filtrarRetiradas(q) {
  let lista = [...db.withdrawals];
  if (q.get("categoria")) lista = lista.filter((w) => w.categoria === q.get("categoria"));
  if (q.get("tipo")) lista = lista.filter((w) => w.tipo === q.get("tipo"));
  if (q.get("reception"))
    lista = lista.filter((w) => w.reception_id === Number(q.get("reception")));
  if (q.get("funcionario")) {
    const termo = q.get("funcionario").toLowerCase();
    lista = lista.filter((w) => w.funcionario_username.toLowerCase().includes(termo));
  }
  if (q.get("startDate"))
    lista = lista.filter((w) => new Date(w.date) >= new Date(q.get("startDate")));
  if (q.get("endDate"))
    lista = lista.filter((w) => new Date(w.date) <= new Date(`${q.get("endDate")}T23:59:59`));

  const periodo = q.get("periodo");
  if (periodo) {
    const agora = new Date();
    lista = lista.filter((w) => {
      const d = new Date(w.date);
      if (periodo === "diario") return d.toDateString() === agora.toDateString();
      if (periodo === "semanal") return agora - d <= 7 * 24 * 60 * 60 * 1000;
      if (periodo === "mensal")
        return (
          d.getFullYear() === Number(q.get("ano") || agora.getFullYear()) &&
          d.getMonth() + 1 === Number(q.get("mes") || agora.getMonth() + 1)
        );
      if (periodo === "anual")
        return d.getFullYear() === Number(q.get("ano") || agora.getFullYear());
      return true;
    });
  }

  return lista.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const fetchOriginal = window.fetch.bind(window);

window.fetch = async (input, init = {}) => {
  const url = new URL(
    typeof input === "string" ? input : input.url,
    window.location.origin
  );
  const rota = url.pathname.replace(/^.*\/api/, "");
  const metodo = (init.method || "GET").toUpperCase();

  for (const [m, padrao, handler] of rotas) {
    const match = m === metodo && padrao.exec(rota);
    if (!match) continue;
    const body = init.body ? JSON.parse(init.body) : {};
    await new Promise((r) => setTimeout(r, 120)); // latência de mentira
    return handler(match, body, url.searchParams);
  }

  return fetchOriginal(input, init);
};
