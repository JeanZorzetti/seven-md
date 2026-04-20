const links = ["Privacidade", "Termos", "Suporte", "Agendamentos"];

export default function Footer() {
  return (
    <footer
      className="w-full border-t"
      style={{
        backgroundColor: "#f9f2f2",
        borderColor: "rgba(228,190,186,0.15)",
      }}
    >
      <div className="w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto space-y-6 md:space-y-0">
        <div className="flex flex-col items-center md:items-start">
          <span
            className="text-xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "var(--font-manrope)", color: "#1d1b1b" }}
          >
            Seven-MD
          </span>
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-inter)", color: "rgba(29,27,27,0.60)" }}
          >
            © 2024 Seven-MD Telemedicina. Autoridade Clínica Editorial.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm underline-offset-4 hover:underline transition-colors footer-link"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
