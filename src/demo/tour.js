// ── src/demo/tour.js
// Guia da demo: leva o visitante pelas telas do sistema.
//
// Vive fora do React de propósito — não importa nada da aplicação e não pede
// marcação nenhuma nas telas. Ele acha os alvos pelo texto que já está na
// página, navega pelo hash e destaca o elemento com um contorno. Em nenhum
// momento bloqueia a página: dá para clicar em qualquer coisa, arrastar,
// filtrar e sair do guia a qualquer momento.

const CHAVE = "demo_tour_visto";
const IDIOMA = "demo_tour_idioma";

const texto = (el) => (el?.textContent || "").trim();

// procura um elemento pelo texto que ele mostra
function porTexto(seletor, trecho) {
  return [...document.querySelectorAll(seletor)].find((el) =>
    texto(el).toLowerCase().includes(trecho.toLowerCase())
  );
}

// sobe do elemento até o cartão/seção que o contém
const secaoDe = (el) => el?.closest("section, article, div.bg-white") || el;

const rotulos = {
  pt: {
    guia: "Guia da demo",
    anterior: "Anterior",
    proximo: "Próximo",
    concluir: "Concluir",
    fechar: "Fechar guia",
    trocar: "Read in English",
  },
  en: {
    guia: "Demo guide",
    anterior: "Back",
    proximo: "Next",
    concluir: "Done",
    fechar: "Close guide",
    trocar: "Ler em português",
  },
};

// Só o guia é bilíngue: o sistema em si é o original, em português.
const passos = [
  {
    rota: "#/",
    pt: {
      titulo: "Bem-vindo à demonstração",
      texto:
        "Este é o sistema de Achados e Perdidos inteiro, rodando no seu navegador. Os dados são fictícios e voltam ao normal se você recarregar a página. Vou te mostrar as telas em um minuto. Pode clicar em qualquer coisa enquanto isso.",
    },
    en: {
      titulo: "Welcome to the demo",
      texto:
        "This is the whole Lost and Found system, running inside your browser. The data is fictional and goes back to normal when you reload the page. I will walk you through the screens in about a minute. Feel free to click anything meanwhile. The system itself is in Portuguese, as it was built.",
    },
  },
  {
    rota: "#/",
    pt: {
      titulo: "Consulta pública",
      texto:
        "Esta é a única tela aberta a todo mundo. Quem perdeu algo procura aqui, sem login. Os itens ficam separados em dois grupos: prioritários, de valor alto ou documentos pessoais, e comuns, os objetos do dia a dia.",
    },
    en: {
      titulo: "Public lookup",
      texto:
        "This is the only screen open to everyone. Whoever lost something searches here, with no login. Items are split in two groups: priority, meaning high value or personal documents, and common, the everyday objects.",
    },
    alvo: () => secaoDe(porTexto("h2", "Itens Prioritários")),
  },
  {
    rota: "#/",
    pt: {
      titulo: "Filtros",
      texto:
        "Dá para reduzir a lista por categoria, local onde o item foi achado, recepção que registrou e tipo. Experimente: escolha Eletrônicos e veja a separação entre um iPhone e um carregador comum.",
    },
    en: {
      titulo: "Filters",
      texto:
        "You can narrow the list by category, where the item was found, which front desk registered it and type. Try it: pick Eletrônicos and see an iPhone sitting apart from an ordinary charger.",
    },
    alvo: () => document.querySelector("select")?.closest("div"),
  },
  {
    rota: "#/admin-login",
    pt: {
      titulo: "Acesso da equipe",
      texto:
        "O resto do sistema é interno. As credenciais da demo já vêm preenchidas (admin / admin). Clique em Entrar, ou em Próximo que eu entro por você.",
    },
    en: {
      titulo: "Staff access",
      texto:
        "The rest of the system is internal. The demo credentials are already filled in (admin / admin). Click Entrar, or click Next and I will sign in for you.",
    },
    alvo: () => document.querySelector("form"),
  },
  {
    rota: "#/admin",
    pt: {
      titulo: "Dashboard",
      texto:
        "A visão do administrador: quantos itens ainda estão na recepção, quantos foram devolvidos e a taxa de devolução, mais os gráficos de áreas onde mais se perde coisa, categorias e devoluções por mês.",
    },
    en: {
      titulo: "Dashboard",
      texto:
        "The admin view: how many items are still at the front desk, how many were returned and the return rate, plus charts for the areas where most things get lost, categories and returns per month.",
    },
    alvo: () => secaoDe(porTexto("p", "Itens Disponíveis")),
  },
  {
    rota: "#/admin/itens",
    pt: {
      titulo: "Cadastrar um item",
      texto:
        "Quando alguém entrega um objeto na recepção, ele entra por aqui: tipo, categoria, data, local, recepção e uma pergunta de segurança que só o dono saberia responder.",
    },
    en: {
      titulo: "Logging an item",
      texto:
        "When someone hands an object to the front desk, it goes in here: type, category, date, place, reception point and a security question only the owner would be able to answer.",
    },
    alvo: () => porTexto("button", "Adicionar"),
  },
  {
    rota: "#/admin/itens",
    pt: {
      titulo: "Registrar a retirada",
      texto:
        "Os três ícones de cada item são ver, editar e retirar. A retirada é o coração do sistema: a recepção confere a pergunta de segurança, anota nome, CPF e telefone de quem levou, e o item sai do acervo com tudo registrado. Abra um e veja.",
    },
    en: {
      titulo: "Registering a claim",
      texto:
        "The three icons on each item are view, edit and hand over. The claim is the heart of the system: the staff checks the security question, records the name, ID number and phone of whoever took it, and the item leaves the shelf with everything logged. Open one and see.",
    },
    alvo: () => {
      const b = document.querySelector('button[title="Retirar este item"]');
      // na tabela o alvo é a linha; no celular, o cartão do item
      return b?.closest("tr") || b?.closest("div.rounded-xl");
    },
  },
  {
    rota: "#/admin/relatorios",
    pt: {
      titulo: "Relatórios",
      texto:
        "Todo histórico de retiradas fica aqui, com filtro por período, funcionário, categoria e recepção. O CPF aparece mascarado na listagem. O botão Exportar gera um PDF do período escolhido. Pode baixar, funciona de verdade.",
    },
    en: {
      titulo: "Reports",
      texto:
        "Every claim ends up here, filtered by period, staff member, category and reception point. ID numbers are masked in the listing. The Exportar button builds a PDF for the chosen period. Go ahead and download it, it really works.",
    },
    alvo: () => porTexto("button", "Exportar"),
  },
  {
    rota: "#/admin/locais",
    pt: {
      titulo: "Locais e recepções",
      texto:
        "Nada aqui é fixo no código. A instituição cadastra as próprias recepções e os próprios locais, por isso o mesmo sistema serve uma escola pequena ou um campus com vários blocos.",
    },
    en: {
      titulo: "Places and front desks",
      texto:
        "Nothing here is hardcoded. Each institution registers its own reception points and its own places, which is why the same system fits a small school or a campus with several buildings.",
    },
    alvo: () => secaoDe(porTexto("h2", "Recepções")),
  },
  {
    rota: "#/admin/create-user",
    pt: {
      titulo: "Usuários e permissões",
      texto:
        "Dois papéis: administrador, que vê tudo, e funcionário, que cuida dos itens da recepção dele. Experimente sair e entrar como recepcao.a / demo para ver o sistema com menos permissões.",
    },
    en: {
      titulo: "Users and permissions",
      texto:
        "Two roles: admin, who sees everything, and staff, who handle the items of their own front desk. Try signing out and back in as recepcao.a / demo to see the system with fewer permissions.",
    },
    alvo: () => secaoDe(porTexto("h2", "Funcionários")),
  },
  {
    rota: "#/",
    pt: {
      titulo: "É só isso",
      texto:
        "Agora explore à vontade: cadastre um item, registre uma retirada, gere um relatório. Nada disso sai do seu navegador, e um F5 devolve tudo ao estado inicial.",
    },
    en: {
      titulo: "That is all",
      texto:
        "Now explore on your own: log an item, register a claim, generate a report. None of it leaves your browser, and a refresh puts everything back to where it started.",
    },
  },
];

let atual = 0;
let painel;
let destacado;

// pt para quem navega em português, en para todo o resto; trocável no painel
const salvo = sessionStorage.getItem(IDIOMA);
const doNavegador = (navigator.language || "en").toLowerCase();
let idioma = salvo || (doNavegador.startsWith("pt") ? "pt" : "en");

function estilos() {
  const s = document.createElement("style");
  s.textContent = `
    /* Painel escuro: destaca-se da página sem cobrir nada dela. */
    #demo-tour {
      position: fixed; z-index: 60; right: 20px; bottom: 20px; width: 368px;
      max-width: calc(100vw - 32px);
      background: #064e3b; color: #fff;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 18px;
      box-shadow: 0 24px 60px rgba(2,44,34,.45), 0 0 0 1px rgba(6,95,70,.1);
      font: 400 13.5px/1.6 system-ui, sans-serif; overflow: hidden;
      animation: demo-tour-entra .3s cubic-bezier(.2,.9,.3,1.3);
    }
    @keyframes demo-tour-entra {
      from { opacity: 0; transform: translateY(16px) scale(.96) }
    }
    /* pulso curto a cada passo, para o olho voltar ao painel */
    #demo-tour.mudou { animation: demo-tour-chama .5s ease-out }
    @keyframes demo-tour-chama {
      0% { box-shadow: 0 24px 60px rgba(2,44,34,.45), 0 0 0 0 rgba(16,185,129,.5) }
      100% { box-shadow: 0 24px 60px rgba(2,44,34,.45), 0 0 0 16px rgba(16,185,129,0) }
    }

    #demo-tour header {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      padding: 12px 16px 10px;
    }
    #demo-tour header span {
      display: flex; align-items: center; gap: 7px;
      font: 700 11px/1 system-ui, sans-serif; letter-spacing: .08em;
      text-transform: uppercase; color: #6ee7b7;
    }
    #demo-tour header span::before {
      content: ""; width: 7px; height: 7px; border-radius: 50%;
      background: #34d399; box-shadow: 0 0 0 0 rgba(52,211,153,.7);
      animation: demo-tour-ponto 2s ease-out infinite;
    }
    @keyframes demo-tour-ponto {
      70% { box-shadow: 0 0 0 7px rgba(52,211,153,0) }
      100% { box-shadow: 0 0 0 0 rgba(52,211,153,0) }
    }
    #demo-tour header .acoes { display: flex; align-items: center; gap: 4px }
    #demo-tour header button {
      all: unset; cursor: pointer; font-size: 16px; line-height: 1;
      color: rgba(255,255,255,.55); padding: 2px 6px; border-radius: 6px;
    }
    #demo-tour header button:hover { color: #fff; background: rgba(255,255,255,.1) }
    #demo-tour header .idioma {
      font: 700 10px/1 system-ui, sans-serif; letter-spacing: .06em;
      padding: 5px 8px; border: 1px solid rgba(255,255,255,.25); color: rgba(255,255,255,.8);
    }

    #demo-tour .corpo { padding: 0 16px 14px }
    #demo-tour h3 { margin: 0 0 7px; font: 700 17px/1.25 system-ui, sans-serif; color: #fff }
    #demo-tour p { margin: 0; color: rgba(255,255,255,.82) }

    #demo-tour .barra { height: 3px; background: rgba(255,255,255,.12); margin: 0 16px; border-radius: 9999px }
    #demo-tour .barra i {
      display: block; height: 100%; border-radius: 9999px;
      background: linear-gradient(90deg, #34d399, #6ee7b7);
      transition: width .35s cubic-bezier(.4,0,.2,1);
    }

    /* Posições fixas: "Próximo" nunca sai do lugar entre um passo e outro. */
    #demo-tour .rodape {
      display: grid; grid-template-columns: auto 1fr auto;
      align-items: center; gap: 10px; padding: 14px 16px 16px;
    }
    #demo-tour .rodape button {
      all: unset; cursor: pointer; border-radius: 9999px;
      padding: 9px 18px; font: 600 13px/1 system-ui, sans-serif; text-align: center;
      transition: background .15s, color .15s, opacity .15s;
    }
    #demo-tour .voltar {
      grid-column: 1; border: 1px solid rgba(255,255,255,.25); color: rgba(255,255,255,.9);
    }
    #demo-tour .voltar:hover:not([disabled]) { background: rgba(255,255,255,.12) }
    #demo-tour .voltar[disabled] { opacity: .3; cursor: default }
    #demo-tour .avancar {
      grid-column: 3; background: #fff; color: #064e3b;
      box-shadow: 0 4px 14px rgba(0,0,0,.2);
    }
    #demo-tour .avancar:hover { background: #d1fae5 }

    /* botão para (re)abrir o guia */
    #demo-tour-abrir {
      position: fixed; z-index: 60; right: 20px; bottom: 20px;
      display: flex; align-items: center; gap: 8px;
      padding: 11px 20px; border-radius: 9999px; border: none; cursor: pointer;
      background: #064e3b; color: #fff; font: 600 13px/1 system-ui, sans-serif;
      box-shadow: 0 12px 30px rgba(2,44,34,.4);
      animation: demo-tour-entra .3s ease-out;
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
      #demo-tour .corpo { padding: 0 14px 12px }
      #demo-tour .rodape { padding: 12px 14px 14px }
      #demo-tour h3 { font-size: 16px }
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
  const conteudo = passo[idioma] || passo.pt;
  const r = rotulos[idioma];
  const ultimo = atual === passos.length - 1;

  // "Anterior" está sempre presente, apenas desabilitado no primeiro passo:
  // assim o "Próximo" fica no mesmo lugar do começo ao fim e nenhum botão
  // troca de posição debaixo do cursor.
  painel.innerHTML = `
    <header>
      <span>${r.guia} &middot; ${atual + 1}/${passos.length}</span>
      <div class="acoes">
        <button class="idioma" data-acao="idioma" title="${r.trocar}">
          ${idioma === "pt" ? "EN" : "PT"}
        </button>
        <button data-acao="fechar" aria-label="${r.fechar}" title="${r.fechar}">&times;</button>
      </div>
    </header>
    <div class="barra"><i style="width:${((atual + 1) / passos.length) * 100}%"></i></div>
    <div class="corpo">
      <h3></h3>
      <p></p>
    </div>
    <div class="rodape">
      <button class="voltar" data-acao="voltar" ${atual === 0 ? "disabled" : ""}>
        ${r.anterior}
      </button>
      <button class="avancar" data-acao="${ultimo ? "fechar" : "avancar"}">
        ${ultimo ? r.concluir : r.proximo}
      </button>
    </div>
  `;
  // texto por textContent: nada do conteúdo vira HTML
  painel.querySelector("h3").textContent = conteudo.titulo;
  painel.querySelector("p").textContent = conteudo.texto;

  // pisca de leve a cada troca de passo (na abertura, a animação de entrada
  // já chama atenção sozinha)
  if (painel.dataset.pintado) {
    painel.classList.remove("mudou");
    void painel.offsetWidth;
    painel.classList.add("mudou");
  }
  painel.dataset.pintado = "1";
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
  b.innerHTML = `&#9654; ${rotulos[idioma].guia}`;
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
    if (acao === "idioma") {
      idioma = idioma === "pt" ? "en" : "pt";
      sessionStorage.setItem(IDIOMA, idioma);
      pintar();
    }
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
