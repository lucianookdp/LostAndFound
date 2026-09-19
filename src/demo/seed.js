// ── src/demo/seed.js
// Dados fictícios da demo. Nenhum dado real de aluno ou funcionário.

const dia = 24 * 60 * 60 * 1000;
const atras = (d) => new Date(Date.now() - d * dia);
const iso = (d) => atras(d).toISOString();

export const receptions = [
  { id: 1, name: "Recepção Bloco A" },
  { id: 2, name: "Recepção Bloco B" },
  { id: 3, name: "Recepção Biblioteca" },
];

export const locations = [
  { id: 1, name: "Biblioteca" },
  { id: 2, name: "Cantina" },
  { id: 3, name: "Quadra Poliesportiva" },
  { id: 4, name: "Laboratório de Informática" },
  { id: 5, name: "Auditório" },
  { id: 6, name: "Estacionamento" },
  { id: 7, name: "Sala 204 - Bloco A" },
  { id: 8, name: "Corredor Bloco C" },
];

export const users = [
  {
    id: 1,
    username: "admin",
    password: "admin",
    nome: "Administrador da Demo",
    cpf: "31845027619",
    role: "admin",
    reception_id: 1,
  },
  {
    id: 2,
    username: "recepcao.a",
    password: "demo",
    nome: "Recepcionista Bloco A",
    cpf: "68201594730",
    role: "func",
    reception_id: 1,
  },
  {
    id: 3,
    username: "recepcao.b",
    password: "demo",
    nome: "Recepcionista Bloco B",
    cpf: "90473618254",
    role: "func",
    reception_id: 2,
  },
];

// tipo: "prioritario" (exige pergunta de segurança na retirada) | "comum"
const itensBrutos = [
  ["prioritario", "Carteira de couro marrom", "Acessórios", 1, 3, 2, "Quantos cartões tinha dentro?"],
  ["prioritario", "Notebook Dell Inspiron", "Eletrônicos", 4, 1, 0, "Qual o adesivo na tampa?"],
  ["prioritario", "Chave de carro com controle", "Acessórios", 6, 2, 1, "Qual a marca do carro?"],
  ["prioritario", "Fone de ouvido sem fio", "Eletrônicos", 1, 3, 4, "Qual a cor do estojo?"],
  ["prioritario", "Óculos de grau com estojo", "Acessórios", 5, 1, 6, "Qual a cor da armação?"],
  ["prioritario", "Celular Motorola", "Eletrônicos", 2, 1, 7, "Qual a imagem de bloqueio?"],
  ["prioritario", "Documento de identidade", "Documentos", 7, 1, 9, "Qual o ano de emissão?"],
  ["prioritario", "Aliança dourada", "Acessórios", 3, 2, 11, "Tem gravação por dentro? Qual?"],
  ["prioritario", "Cartão de crédito", "Documentos", 2, 2, 12, "Qual o banco emissor?"],
  ["comum", "Garrafa térmica azul", "Outros", 3, 2, 1, "Tem adesivos? Quais?"],
  ["comum", "Caderno universitário 10 matérias", "Materiais Acadêmicos", 1, 3, 2, "Qual o nome na capa?"],
  ["comum", "Guarda-chuva preto", "Outros", 8, 1, 3, "Automático ou manual?"],
  ["comum", "Moletom cinza tamanho M", "Vestuário", 3, 2, 5, "Tem estampa? Qual?"],
  ["comum", "Mochila azul marinho", "Bolsas e Mochilas", 5, 1, 6, "O que tem dentro?"],
  ["comum", "Calculadora científica", "Materiais Acadêmicos", 4, 1, 7, "Qual o modelo?"],
  ["comum", "Boné preto", "Vestuário", 3, 2, 8, "Qual o time ou marca?"],
  ["comum", "Estojo com canetas", "Materiais Acadêmicos", 7, 1, 9, "Qual a cor do estojo?"],
  ["comum", "Jaqueta jeans", "Vestuário", 2, 2, 10, "Tem algo no bolso?"],
  ["comum", "Squeeze rosa", "Outros", 3, 2, 11, "Tem nome escrito?"],
  ["comum", "Livro de Cálculo I", "Materiais Acadêmicos", 1, 3, 13, "Qual a edição?"],
  ["comum", "Carregador de celular", "Eletrônicos", 4, 1, 14, "Qual o tipo de conector?"],
  ["comum", "Bolsa transversal bege", "Bolsas e Mochilas", 2, 2, 16, "O que tem dentro?"],
  ["comum", "Cachecol vinho", "Vestuário", 8, 1, 18, "É de lã ou tricô?"],
  ["comum", "Pen drive 32GB", "Eletrônicos", 4, 1, 21, "Qual a cor?"],
];

export const items = itensBrutos.map(
  ([tipo, nome, categoria, location_id, reception_id, dias, security_question], i) => ({
    id: i + 1,
    tipo,
    nome,
    categoria,
    location_id,
    location_name: locations.find((l) => l.id === location_id).name,
    reception_id,
    reception_name: receptions.find((r) => r.id === reception_id).name,
    data: iso(dias),
    security_question,
  })
);

// Retiradas já registradas, espalhadas nos últimos meses para os gráficos.
const retiradasBrutas = [
  ["Carteira preta", "Acessórios", "prioritario", "Ana Beatriz Moraes", "12345678901", "(42) 99801-1122", "academico", "20231045", "Engenharia de Software", "recepcao.a", 4],
  ["Chave de armário", "Acessórios", "comum", "Carlos Eduardo Lima", "23456789012", "(42) 99812-3344", "academico", "20229987", "Direito", "recepcao.a", 9],
  ["Tablet Samsung", "Eletrônicos", "prioritario", "Marina Alves Costa", "34567890123", "(42) 99823-5566", "academico", "20241122", "Medicina Veterinária", "recepcao.b", 15],
  ["Agasalho azul", "Vestuário", "comum", "Rafael Pires Nunes", "45678901234", "(42) 99834-7788", "externo", null, null, "recepcao.b", 23],
  ["Apostila de Anatomia", "Materiais Acadêmicos", "comum", "Juliana Ferreira", "56789012345", "(42) 99845-9900", "academico", "20230456", "Enfermagem", "recepcao.a", 31],
  ["Relógio digital", "Acessórios", "prioritario", "Thiago Barbosa", "67890123456", "(42) 99856-1122", "academico", "20228877", "Administração", "recepcao.a", 44],
  ["Mochila cinza", "Bolsas e Mochilas", "comum", "Patrícia Gomes", "78901234567", "(42) 99867-3344", "externo", null, null, "recepcao.b", 58],
  ["Carregador de notebook", "Eletrônicos", "comum", "Lucas Andrade", "89012345678", "(42) 99878-5566", "academico", "20240033", "Sistemas de Informação", "recepcao.b", 72],
  ["CNH", "Documentos", "prioritario", "Fernanda Ribeiro", "90123456789", "(42) 99889-7788", "externo", null, null, "recepcao.a", 95],
  ["Caderno de Química", "Materiais Acadêmicos", "comum", "Gustavo Martins", "01234567890", "(42) 99890-9900", "academico", "20231199", "Farmácia", "recepcao.a", 110],
  ["Bolsa de couro", "Bolsas e Mochilas", "prioritario", "Camila Rocha", "11947382605", "(42) 99811-2233", "externo", null, null, "recepcao.b", 133],
  ["Boné branco", "Vestuário", "comum", "Vinícius Teixeira", "28560417392", "(42) 99822-4455", "academico", "20225566", "Educação Física", "recepcao.b", 158],
  ["Fone com fio", "Eletrônicos", "comum", "Isabela Cardoso", "73029584617", "(42) 99833-6677", "academico", "20242288", "Psicologia", "recepcao.a", 179],
  ["Guarda-chuva xadrez", "Outros", "comum", "Roberto Salles", "46183720954", "(42) 99844-8899", "externo", null, null, "recepcao.a", 201],
];

export const withdrawals = retiradasBrutas.map(
  ([item_nome, categoria, tipo, nome, cpf, telefone, pessoa_tipo, ra, curso, funcionario_username, dias], i) => {
    const d = atras(dias);
    const rec = receptions.find(
      (r) => r.id === (funcionario_username === "recepcao.b" ? 2 : 1)
    );
    return {
      id: i + 1,
      item_id: null,
      item_nome,
      categoria,
      tipo,
      nome,
      cpf,
      telefone,
      pessoa_tipo,
      ra,
      curso,
      funcionario_username,
      reception_id: rec.id,
      reception_name: rec.name,
      location_name: locations[i % locations.length].name,
      date: d.toISOString(),
      created_at: d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }
);
