export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative">
      {/* Left column */}
      <div className="lg:col-span-6 z-10 space-y-8">
        <div
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium tracking-wide"
          style={{
            backgroundColor: "#bee9ff",
            color: "#004d65",
            fontFamily: "var(--font-inter)",
          }}
        >
          <span className="material-symbols-outlined mr-2 text-sm">monitor_heart</span>
          A evolução da saúde digital
        </div>

        <h1
          className="text-5xl lg:text-[3.5rem] leading-[1.1] font-extrabold tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-manrope)", color: "#1d1b1b" }}
        >
          Telemedicina com a confiança{" "}
          <span className="block mt-2" style={{ color: "#af101a" }}>
            Seven-MD.
          </span>
        </h1>

        <p
          className="text-lg leading-[1.6] max-w-xl"
          style={{ fontFamily: "var(--font-inter)", color: "#5b403d" }}
        >
          Da excelência em equipamentos para a sua casa. Consultas online com
          especialistas renomados, sem filas e com a segurança que você já
          conhece.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            className="px-8 py-4 text-white rounded-full font-medium text-base hover:opacity-90 transition-all duration-300 shadow-[0px_12px_32px_rgba(29,27,27,0.06)] flex items-center justify-center group"
            style={{
              fontFamily: "var(--font-inter)",
              background: "linear-gradient(to bottom right, #af101a, #d32f2f)",
            }}
          >
            Agendar agora
            <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
          <button
            className="px-8 py-4 rounded-full font-medium text-base hover:opacity-90 transition-all duration-300 flex items-center justify-center"
            style={{
              fontFamily: "var(--font-inter)",
              backgroundColor: "#e7e1e1",
              color: "#af101a",
            }}
          >
            Ver especialidades
          </button>
        </div>
      </div>

      {/* Right column */}
      <div className="lg:col-span-6 relative">
        {/* Decorative blobs */}
        <div
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-50 pointer-events-none"
          style={{ backgroundColor: "#ede7e6" }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: "#ffdad6" }}
        />

        {/* Image container */}
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[0px_12px_32px_rgba(29,27,27,0.06)] group" style={{ backgroundColor: "#f9f2f2" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9ar3V62qQXqq4Kn_sytElpEaQxvyZrSd3EIcEFMl1ObU-Y7oRgSNG8SlOnha1JSEVPExp4a9AQat_DyDqFlxwhM8HYTEf2lLfJLgqqrHKLkTUg3suc3KXm66iCB1t6jeSv8Kcx6j75fBUTpeU33-brlInNeAZT7OBHWE5vHgsA78eljmer7H2aww1AvLvV99Jarapw0W1wVDOdm3CkoF0lplTcbcIr7hh7BKmYJ_pBYurvF7TG_JP8c0mn9Lyk-swICIn8NFgrbo"
            alt="Médica em clínica moderna olhando para tablet"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Glassmorphism card */}
          <div
            className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 p-5 rounded-xl shadow-[0px_12px_32px_rgba(29,27,27,0.06)] backdrop-blur-[24px]"
            style={{
              backgroundColor: "rgba(255,248,247,0.70)",
              border: "1px solid rgba(228,190,186,0.15)",
            }}
          >
            <div className="flex items-center space-x-4 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#bee9ff", color: "#001f2a" }}
              >
                <span className="material-symbols-outlined text-2xl">videocam</span>
              </div>
              <div>
                <h3
                  className="font-medium text-sm"
                  style={{ fontFamily: "var(--font-inter)", color: "#1d1b1b" }}
                >
                  Consulta Ativa
                </h3>
                <p
                  className="text-xs"
                  style={{ fontFamily: "var(--font-inter)", color: "#5b403d" }}
                >
                  Dr. Carlos Mendes - Cardiologia
                </p>
              </div>
            </div>
            <div className="w-full rounded-full h-1.5 mt-2" style={{ backgroundColor: "#ede7e6" }}>
              <div
                className="h-1.5 rounded-full w-2/3 animate-pulse"
                style={{ backgroundColor: "#af101a" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
