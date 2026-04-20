"use client";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-[24px] shadow-[0px_12px_32px_rgba(29,27,27,0.06)] transition-all duration-300"
      style={{ backgroundColor: "rgba(255,248,247,0.70)" }}
    >
      <div className="flex justify-between items-center w-full px-8 py-5 max-w-7xl mx-auto">
        <a
          href="#"
          className="text-2xl font-black tracking-tighter hover:opacity-80 transition-all duration-300"
          style={{ fontFamily: "var(--font-manrope)", color: "#af101a" }}
        >
          Seven-MD
        </a>

        <div className="hidden md:flex items-center space-x-8">
          {[
            { label: "Início", active: true },
            { label: "Serviços", active: false },
            { label: "Especialistas", active: false },
            { label: "Sobre", active: false },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className="transition-all duration-300 transform active:scale-95 ease-in-out text-sm tracking-tight font-medium"
              style={{
                fontFamily: "var(--font-manrope)",
                color: item.active ? "#af101a" : "#1d1b1b",
                borderBottom: item.active ? "2px solid #af101a" : "none",
                paddingBottom: item.active ? "4px" : "0",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        <button className="hidden md:flex items-center justify-center px-6 py-2.5 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[0px_12px_32px_rgba(29,27,27,0.06)] transform active:scale-95 ease-in-out"
          style={{
            fontFamily: "var(--font-inter)",
            background: "linear-gradient(to bottom right, #af101a, #d32f2f)",
          }}
        >
          Agendar Consulta
        </button>

        <button className="md:hidden p-2" style={{ color: "#af101a" }}>
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>
    </nav>
  );
}
