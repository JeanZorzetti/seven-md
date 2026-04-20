const steps = [
  {
    icon: "calendar_month",
    iconColor: "#af101a",
    hoverBg: "#ffdad6",
    title: "1. Agende online",
    desc: "Escolha a especialidade, o médico e o horário que melhor se adapta à sua rotina através da nossa plataforma intuitiva.",
    offset: "",
  },
  {
    icon: "devices",
    iconColor: "#005f7b",
    hoverBg: "#bee9ff",
    title: "2. Prepare-se",
    desc: "Receba o link seguro da sua consulta por e-mail ou SMS. Acesse pelo celular, tablet ou computador minutos antes.",
    offset: "md:-translate-y-4",
  },
  {
    icon: "prescriptions",
    iconColor: "#9f3f39",
    hoverBg: "#ffdad6",
    title: "3. Consulta e Receita",
    desc: "Realize a vídeo-consulta com qualidade HD. Receitas, atestados e pedidos de exames são enviados digitalmente com validade legal.",
    offset: "md:-translate-y-8",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "#f9f2f2" }}>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="mb-16 max-w-2xl">
          <h2
            className="text-[1.75rem] font-bold mb-4"
            style={{ fontFamily: "var(--font-manrope)", color: "#1d1b1b" }}
          >
            Como funciona a telemedicina?
          </h2>
          <p
            className="leading-[1.6]"
            style={{ fontFamily: "var(--font-inter)", color: "#5b403d" }}
          >
            Um processo simples, rápido e seguro para conectar você aos
            melhores profissionais de saúde, sem sair de casa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.title}
              className={`rounded-xl p-8 shadow-[0px_12px_32px_rgba(29,27,27,0.06)] group hover:-translate-y-1 transition-transform duration-300 ${step.offset}`}
              style={{ backgroundColor: "#ffffff" }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:opacity-80"
                style={{ backgroundColor: "#ede7e6" }}
              >
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ color: step.iconColor }}
                >
                  {step.icon}
                </span>
              </div>
              <h3
                className="text-xl font-medium mb-3"
                style={{ fontFamily: "var(--font-inter)", color: "#1d1b1b" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-inter)", color: "#5b403d" }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
