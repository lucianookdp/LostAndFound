// ── src/demo/pdf.js
// Gerador de PDF mínimo para a demo: uma página, fonte Courier, sem dependências.
// ponytail: uma página só e sem acentos (Courier usa StandardEncoding). Se o
// relatório precisar de paginação ou acentuação, troque por jsPDF/pdf-lib.

const MAX_LINHAS = 40;

const semAcento = (s) =>
  String(s ?? "—")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7E]/g, "-");

const escapar = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const col = (s, n) => {
  const t = semAcento(s);
  return (t.length > n ? `${t.slice(0, n - 1)}.` : t).padEnd(n);
};

const mascararCPF = (cpf) => {
  const d = String(cpf ?? "").replace(/\D/g, "");
  return d.length === 11 ? `***.${d.slice(3, 6)}.***-${d.slice(8)}` : "—";
};

const TITULOS = {
  diario: "Relatorio diario de retiradas",
  semanal: "Relatorio semanal de retiradas",
  mensal: "Relatorio mensal de retiradas",
  anual: "Relatorio anual de retiradas",
};

export function relatorioPdf(registros, periodo) {
  const linhas = [
    col("ITEM", 30) + col("PESSOA", 24) + col("CPF", 16) + col("FUNCIONARIO", 14) + "DATA",
    "-".repeat(100),
    ...registros
      .slice(0, MAX_LINHAS)
      .map(
        (r) =>
          col(r.item_nome, 30) +
          col(r.nome, 24) +
          col(mascararCPF(r.cpf), 16) +
          col(r.funcionario_username, 14) +
          semAcento(r.created_at)
      ),
  ];

  if (registros.length > MAX_LINHAS)
    linhas.push("", `... e mais ${registros.length - MAX_LINHAS} registros.`);

  const cabecalho = [
    TITULOS[periodo] || "Relatorio de retiradas",
    `Achados e Perdidos - gerado em ${semAcento(new Date().toLocaleString("pt-BR"))}`,
    `${registros.length} registro(s)`,
    "DEMONSTRACAO - dados ficticios",
  ];

  const conteudo =
    `BT /F1 14 Tf 40 800 Td 18 TL\n` +
    cabecalho.map((l) => `(${escapar(semAcento(l))}) Tj T*`).join("\n") +
    `\nET\nBT /F1 8 Tf 40 720 Td 12 TL\n` +
    linhas.map((l) => `(${escapar(l)}) Tj T*`).join("\n") +
    `\nET`;

  const objetos = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] " +
      "/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${conteudo.length} >>\nstream\n${conteudo}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objetos.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}
