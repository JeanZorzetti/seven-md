export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div
        className="rounded-[2rem] p-10 md:p-16 relative overflow-hidden shadow-[0px_12px_32px_rgba(29,27,27,0.06)] flex flex-col md:flex-row items-center justify-between gap-12"
        style={{ background: "linear-gradient(to bottom right, #af101a, #d32f2f)" }}
      >
        {/* Radial overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top right, white, transparent, transparent)",
          }}
        />

        <div className="relative z-10 max-w-2xl text-center md:text-left">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Pronto para cuidar da sua saúde?
          </h2>
          <p
            className="text-lg mb-8 opacity-90"
            style={{ fontFamily: "var(--font-inter)", color: "#fff2f0" }}
          >
            Agende sua consulta agora e experimente o novo padrão de
            atendimento clínico digital da Seven-MD.
          </p>
          <button
            className="px-8 py-4 rounded-full font-medium text-base inline-flex items-center shadow-[0px_12px_32px_rgba(29,27,27,0.06)] hover:opacity-90 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-inter)",
              backgroundColor: "#ffffff",
              color: "#af101a",
            }}
          >
            Agendar sua consulta agora
            <span className="material-symbols-outlined ml-2">calendar_add_on</span>
          </button>
        </div>

        <div className="relative z-10 hidden md:block">
          <div
            className="w-48 h-48 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.20)",
            }}
          >
            <span className="material-symbols-outlined text-6xl text-white opacity-80">
              stethoscope
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
