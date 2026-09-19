// ── src/demo/tour.js
// Guia da demo: leva o visitante pelas telas do sistema.
//
// Vive fora do React de propósito — não importa nada da aplicação e não pede
// marcação nenhuma nas telas. Ele acha os alvos pelo texto que já está na
// página, navega pelo hash e destaca o elemento com um contorno. Em nenhum
// momento bloqueia a página: dá para clicar em qualquer coisa, arrastar,
// filtrar e sair do guia a qualquer momento.

const CHAVE = "demo_tour_visto";

const texto = (el) => (el?.textContent || "").trim();

// procura um elemento pelo texto que ele mostra
function porTexto(seletor, trecho) {
  return [...document.querySelectorAll(seletor)].find((el) =>
    texto(el).toLowerCase().includes(trecho.toLowerCase())
  );
}

// sobe do elemento até o cartão/seção que o contém
const secaoDe = (el) => el?.closest("section, article, div.bg-white") || el;

const passos = [
  {
    rota: "#/",
    titulo: "Bem-vindo à demonstração",
    texto:
      "Este é o sistema de Achados e Perdidos inteiro, rodando no seu navegador. Os dados são fictícios e voltam ao normal se você recarregar a página. Vou te mostrar as telas em um minuto — pode clicar em qualquer coisa enquanto isso.",
  },
  {
    rota: "#/",
    titulo: "Consulta pública",
    texto:
      "Esta é a única tela aberta a todo mundo. Quem perdeu algo procura aqui, sem login. Os itens ficam separados em dois grupos: prioritários, de valor alto ou documentos pessoais, e comuns, os objetos do dia a dia.",
    alvo: () => secaoDe(porTexto("h2", "Itens Prioritários")),
  },
  {
    rota: "#/",
    titulo: "Filtros",
    texto:
      "Dá para reduzir a lista por categoria, local onde o item foi achado, recepção que registrou e tipo. Experimente: escolha Eletrônicos e veja a separação entre um iPhone e um carregador comum.",
    alvo: () => document.querySelector("select")?.closest("div"),
  },
  {
    rota: "#/admin-login",
    titulo: "Acesso da equipe",
    texto:
      "O resto do sistema é interno. As credenciais da demo já vêm preenchidas (admin / admin) — clique em Entrar, ou em Próximo que eu entro por você.",
    alvo: () => document.querySelector("form"),
  },
  {
    rota: "#/admin",
    titulo: "Dashboard",
    texto:
      "A visão do administrador: quantos itens ainda estão na recepção, quantos foram devolvidos e a taxa de devolução, mais os gráficos de áreas onde mais se perde coisa, categorias e devoluções por mês.",
    alvo: () => secaoDe(porTexto("p", "Itens Disponíveis")),
  },
  {
    rota: "#/admin/itens",
    titulo: "Cadastrar um item",
    texto:
      "Quando alguém entrega um objeto na recepção, ele entra por aqui: tipo, categoria, data, local, recepção e uma pergunta de segurança que só o dono saberia responder.",
    alvo: () => porTexto("button", "Adicionar"),
  },
  {
    rota: "#/admin/itens",
    titulo: "Registrar a retirada",
    texto:
      "Os três ícones de cada item são ver, editar e retirar. A retirada é o coração do sistema: a recepção confere a pergunta de segurança, anota nome, CPF e telefone de quem levou, e o item sai do acervo com tudo registrado. Abra um e veja.",
    alvo: () => {
      const b = document.querySelector('button[title="Retirar este item"]');
      // na tabela o alvo é a linha; no celular, o cartão do item
      return b?.closest("tr") || b?.closest("div.rounded-xl");
    },
  },
  {
    rota: "#/admin/relatorios",
    titulo: "Relatórios",
    texto:
      "Todo histórico de retiradas fica aqui, com filtro por período, funcionário, categoria e recepção. O CPF aparece mascarado na listagem. O botão Exportar gera um PDF do período escolhido — pode baixar, funciona de verdade.",
    alvo: () => porTexto("button", "Exportar"),
  },
  {
    rota: "#/admin/locais",
    titulo: "Locais e recepções",
    texto:
      "Nada aqui é fixo no código. A instituição cadastra as próprias recepções e os próprios locais — por isso o mesmo sistema serve uma escola pequena ou um campus com vários blocos.",
    alvo: () => secaoDe(porTexto("h2", "Recepções")),
  },
  {
    rota: "#/admin/create-user",
    titulo: "Usuários e permissões",
    texto:
      "Dois papéis: administrador, que vê tudo, e funcionário, que cuida dos itens da recepção dele. Experimente sair e entrar como recepcao.a / demo para ver o sistema com menos permissões.",
    alvo: () => secaoDe(porTexto("h2", "Funcionários")),
  },
  {
    rota: "#/",
    titulo: "É só isso",
    texto:
      "Agora explore à vontade — cadastre um item, registre uma retirada, gere um relatório. Nada disso sai do seu navegador, e um F5 devolve tudo ao estado inicial.",
  },
];

let atual = 0;
let painel;
let destacado;

function estilos() {
  const s = document.createElement("style");
  s.textContent = `
    #demo-tour {
      position: fixed; z-index: 60; right: 16px; bottom: 16px; width: 330px;
      max-width: calc(100vw - 32px);
      background: #fff; color: #1f2937; border: 1px solid rgba(6,95,70,.15);
      border-radius: 16px; box-shadow: 0 18px 40px rgba(6,95,70,.22);
      font: 400 13px/1.5 system-ui, sans-serif; overflow: hidden;
      animation: demo-tour-entra .25s ease-out;
    }
    @keyframes demo-tour-entra { from { opacity: 0; transform: translateY(10px) } }
    #demo-tour header {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      padding: 10px 14px; background: #065f46; color: #fff;
    }
    #demo-tour header span { font: 600 11px/1 system-ui, sans-serif; letter-spacing: .04em; text-transform: uppercase; opacity: .85 }
    #demo-tour header button { all: unset; cursor: pointer; font-size: 13px; opacity: .8; padding: 2px 6px }
    #demo-tour header button:hover { opacity: 1 }
    #demo-tour .corpo { padding: 14px }
    #demo-tour h3 { margin: 0 0 6px; font: 600 15px/1.3 system-ui, sans-serif; color: #065f46 }
    #demo-tour p { margin: 0 }
    #demo-tour .barra { height: 3px; background: #ecfdf5 }
    #demo-tour .barra i { display: block; height: 100%; background: #10b981; transition: width .3s ease }
    #demo-tour .rodape { display: flex; align-items: center; gap: 8px; padding: 0 14px 14px }
    #demo-tour .rodape button { all: unset; cursor: pointer; border-radius: 9999px; padding: 7px 14px; font: 600 12px/1 system-ui, sans-serif; text-align: center }
    #demo-tour .avancar { background: #065f46; color: #fff; flex: 1 }
    #demo-tour .avancar:hover { background: #047857 }
    #demo-tour .voltar { border: 1px solid #d1d5db; color: #4b5563 }
    #demo-tour .voltar:hover { background: #f9fafb }
    #demo-tour .sair { color: #6b7280; margin-left: auto; font-weight: 500 !important }
    #demo-tour .sair:hover { color: #111827 }

    /* botão para (re)abrir o guia */
    #demo-tour-abrir {
      position: fixed; z-index: 60; right: 16px; bottom: 16px;
      display: flex; align-items: center; gap: 6px;
      padding: 9px 16px; border-radius: 9999px; border: none; cursor: pointer;
      background: #065f46; color: #fff; font: 600 12px/1 system-ui, sans-serif;
      box-shadow: 0 8px 22px rgba(6,95,70,.28);
    }
    #demo-tour-abrir:hover { background: #047857 }

    /* alvo destacado: só contorno, nunca bloqueia clique */
    .demo-tour-alvo {
      outline: 3px solid #10b981 !important; outline-offset: 4px;
      border-radius: 14px; animation: demo-tour-pulso 1.6s ease-in-out 2;
    }
    @keyframes demo-tour-pulso {
      50% { outline-color: rgba(16,185,129,.35) }
    }

    @media (max-width: 640px) {
      #demo-tour { left: 12px; right: 12px; bottom: 12px; width: auto }
      #demo-tour .corpo { padding: 12px }
      #demo-tour .rodape { padding: 0 12px 12px }
    }
    @media print { #demo-tour, #demo-tour-abrir { display: none } }
  `;
  document.head.appendChild(s);
}

function limparDestaque() {
  destacado?.classList.remove("demo-tour-alvo");
  destacado = null;
}

// o alvo só existe depois que a rota renderiza, então tentamos por um tempo
function destacar(buscar) {
  limparDestaque();
  if (!buscar) return;
  const limite = Date.now() + 2000;
  (function tentar() {
    let el = null;
    try {
      el = buscar();
    } catch {
      el = null;
    }
    if (el) {
      destacado = el;
      el.classList.add("demo-tour-alvo");
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    } else if (Date.now() < limite) {
      setTimeout(tentar, 120);
    }
  })();
}

async function garantirLogin() {
  if (sessionStorage.getItem("auth_user")) return;
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin" }),
    });
    const { user } = await res.json();
    if (user) sessionStorage.setItem("auth_user", JSON.stringify(user));
  } catch {
    /* na demo o login nunca falha, mas se falhar o guia continua */
  }
}

async function ir(i) {
  atual = Math.max(0, Math.min(passos.length - 1, i));
  const passo = passos[atual];

  if (passo.rota.startsWith("#/admin") && passo.rota !== "#/admin-login") {
    await garantirLogin();
  }

  if (location.hash !== passo.rota) {
    limparDestaque();
    location.hash = passo.rota;
    await new Promise((r) => setTimeout(r, 420));
  }

  pintar();
  destacar(passo.alvo);
}

function pintar() {
  const passo = passos[atual];
  const ultimo = atual === passos.length - 1;

  painel.innerHTML = `
    <header>
      <span>Guia &middot; ${atual + 1} de ${passos.length}</span>
      <button data-acao="fechar" aria-label="Fechar guia">&times;</button>
    </header>
    <div class="barra"><i style="width:${((atual + 1) / passos.length) * 100}%"></i></div>
    <div class="corpo">
      <h3></h3>
      <p></p>
    </div>
    <div class="rodape">
      ${atual > 0 ? '<button class="voltar" data-acao="voltar">Anterior</button>' : ""}
      <button class="avancar" data-acao="${ultimo ? "fechar" : "avancar"}">
        ${ultimo ? "Explorar por conta própria" : "Próximo"}
      </button>
      ${!ultimo ? '<button class="sair" data-acao="fechar">Sair</button>' : ""}
    </div>
  `;
  // texto por textContent: nada do conteúdo vira HTML
  painel.querySelector("h3").textContent = passo.titulo;
  painel.querySelector("p").textContent = passo.texto;
}

function fechar() {
  limparDestaque();
  painel?.remove();
  painel = null;
  sessionStorage.setItem(CHAVE, "1");
  mostrarBotao();
}

function mostrarBotao() {
  if (document.getElementById("demo-tour-abrir")) return;
  const b = document.createElement("button");
  b.id = "demo-tour-abrir";
  b.innerHTML = "&#9654; Guia da demo";
  b.onclick = () => {
    b.remove();
    abrir(0);
  };
  document.body.appendChild(b);
}

function abrir(i = 0) {
  sessionStorage.setItem(CHAVE, "1");
  document.getElementById("demo-tour-abrir")?.remove();
  painel = document.createElement("div");
  painel.id = "demo-tour";
  painel.addEventListener("click", (e) => {
    const acao = e.target.dataset?.acao;
    if (acao === "fechar") fechar();
    if (acao === "avancar") ir(atual + 1);
    if (acao === "voltar") ir(atual - 1);
  });
  document.body.appendChild(painel);
  ir(i);
}

export function iniciarTour() {
  estilos();
  // só abre sozinho na primeira visita da aba, e na consulta pública
  const primeiraVez = !sessionStorage.getItem(CHAVE);
  const naHome = !location.hash || location.hash === "#/";
  if (primeiraVez && naHome) setTimeout(() => abrir(0), 900);
  else mostrarBotao();
}
