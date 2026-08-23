import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full bg-[#222222] text-white pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
        {/* Redes Sociais */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">
            Redes Sociais
          </h3>
          <div className="flex justify-center md:justify-start gap-5 text-2xl mt-3">
            <FaFacebookF className="hover:text-[#3B5998] cursor-pointer transition duration-300" />
            <FaInstagram className="hover:text-[#FF416C] cursor-pointer transition duration-300" />
            <FaXTwitter className="hover:text-[#999999] cursor-pointer transition duration-300" />
            <FaYoutube className="hover:text-[#FF0000] cursor-pointer transition duration-300" />
          </div>
        </div>

        {/* Informações Institucionais */}
        <div className="text-sm space-y-1">
          <p className="font-semibold text-white">Instituição de Ensino</p>
          <p className="text-gray-300">Telefone: (00) 0000-0000</p>
          <p className="text-gray-300">
            Endereço: Rua Exemplo, 123 – Bairro Centro
          </p>
          <p className="text-gray-300">Cidade – UF | CEP 00000-000</p>
        </div>
      </div>

      {/* Linha e Direitos */}
      <div className="border-t border-white/20 mt-10 pt-4">
        <p className="text-xs text-center text-gray-400">
          © {new Date().getFullYear()} Sistema de Achados e Perdidos – Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
