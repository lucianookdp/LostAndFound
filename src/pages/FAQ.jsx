// ── pages/FAQ.jsx
import { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiBox,
  FiLock,
  FiShield,
} from "react-icons/fi";
import HeaderAdmin from "../components/HeaderAdmin";
import HeaderFunc from "../components/HeaderFunc";
import Footer from "../components/Footer";

const faqData = [
  {
    category: "Cadastro de Itens",
    icon: <FiBox className="text-emerald-700 w-5 h-5" />,
    questions: [
      {
        q: "Como cadastrar um item perdido?",
        a: "Acesse a página de gerenciamento, clique em '+ Adicionar' e preencha todas as informações obrigatórias do item, como categoria, data e local de entrega.",
      },
      {
        q: "É necessário enviar foto do item?",
        a: "Não. O cadastro de itens não utiliza imagens. Todas as informações necessárias são registradas por meio dos campos de texto e seleção disponíveis no formulário.",
      },
    ],
  },
  {
    category: "Itens Comuns x Itens Prioritários",
    icon: <FiLock className="text-emerald-700 w-5 h-5" />,
    questions: [
      {
        q: "Qual a diferença entre itens comuns e prioritários?",
        a: "A diferença é apenas visual. Os itens prioritários possuem destaque na interface para facilitar sua identificação pelos funcionários, mas todos seguem o mesmo processo de segurança e validação.",
      },
      {
        q: "Por que existe essa diferenciação visual?",
        a: "A distinção serve apenas para organização e rápida identificação de itens mais importantes, como documentos e eletrônicos. No entanto, ambos os tipos de item têm o mesmo nível de segurança na retirada.",
      },
      {
        q: "Como funciona a retirada de um item?",
        a: "Independentemente da categoria, o funcionário deve verificar os dados fornecidos pelo dono, aplicar as perguntas de segurança e registrar a retirada no sistema. Isso garante rastreabilidade e segurança para todos os casos.",
      },
    ],
  },
  {
    category: "Boas Práticas para Funcionários",
    icon: <FiShield className="text-emerald-700 w-5 h-5" />,
    questions: [
      {
        q: "Posso liberar um item sem confirmar os dados do dono?",
        a: "Não. Todos os itens, sejam comuns ou prioritários, só podem ser liberados após a confirmação dos dados e o registro completo da retirada no sistema.",
      },
      {
        q: "E se houver dúvida sobre a posse do item?",
        a: "Em caso de dúvida, o funcionário deve consultar o administrador antes de liberar a retirada, garantindo que o processo siga corretamente e sem riscos de erro.",
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleQuestion = (index) => setOpenIndex(openIndex === index ? null : index);
  let counter = 0;

  const storedUser = sessionStorage.getItem("auth_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {user?.role === "admin" ? <HeaderAdmin /> : <HeaderFunc />}

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FiHelpCircle className="text-emerald-700 w-8 h-8" />
            <h2 className="text-3xl font-bold text-gray-800">
              Perguntas Frequentes
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
            Encontre respostas rápidas sobre o funcionamento do sistema e as boas práticas
            para o gerenciamento de itens perdidos e devolvidos.
          </p>
        </div>

        <div className="space-y-8">
          {faqData.map((section, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white flex items-center gap-2">
                {section.icon}
                <h3 className="text-lg sm:text-xl font-semibold">{section.category}</h3>
              </div>

              <div className="p-6 space-y-3">
                {section.questions.map((item) => {
                  counter++;
                  const id = counter;
                  return (
                    <div key={id} className="border rounded-lg shadow-sm">
                      <button
                        onClick={() => toggleQuestion(id)}
                        className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium hover:bg-emerald-50 transition"
                      >
                        <span>{item.q}</span>
                        {openIndex === id ? (
                          <FiChevronUp className="w-5 h-5 text-emerald-700" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 text-emerald-700" />
                        )}
                      </button>
                      {openIndex === id && (
                        <div className="px-5 py-3 text-gray-700 bg-gray-50 border-t text-sm leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
