const STATS = [
  {
    value: "+200",
    mobileHeight: "h-[7.875rem]",
    label: (
      <>
        creators
        <br />
        no casting
      </>
    ),
    color: "#d1d362",
  },
  {
    value: "+1000",
    mobileHeight: "h-[9.375rem]",
    label: (
      <>
        <span className="text-[2.9845rem] leading-[1.27] md:max-xl:text-[2.9845rem]">
          PrOjetos
        </span>
        <br />
        <span className="text-[2.4870625rem] leading-[1.014] md:max-xl:text-[2.4870625rem]">
          realizados
        </span>
      </>
    ),
    color: "#5c8dc9",
  },
  {
    value: "+1000",
    mobileHeight: "h-[9.375rem]",
    label: (
      <>
        Clientes
        <br />E parceiros
      </>
    ),
    color: "#b1375b",
  },
];

export function AboutV2() {
  return (
    <section
      id="sobre"
      className="flex flex-col items-start justify-center bg-[#fff2e7] px-[2rem] py-[4.5rem] text-[#1a1a1a] md:max-xl:px-[4rem] xl:px-[7.5rem]"
    >
      <div className="flex h-auto w-full flex-col items-start gap-[2rem] md:max-xl:gap-[2.5rem] xl:h-[50rem] xl:flex-row xl:gap-[6.5625rem]">
        <div className="flex h-auto w-full min-w-0 flex-none flex-col items-start justify-center gap-[2rem] rounded-[2rem] bg-[#e5a545] p-[3rem] [container-type:inline-size] md:max-xl:p-[4rem] xl:h-full xl:flex-1 xl:rounded-[2.5rem] xl:p-[4rem]">
          <div className="relative flex w-full min-w-0 shrink-0 flex-col items-start gap-[0.625rem]">
            <h2 className="w-full min-w-0 whitespace-pre-wrap leading-none">
              <span className="mb-0 flex w-full min-w-0 items-center font-heading text-[1.5rem] italic leading-none md:max-xl:text-[2.5rem] xl:text-[2.5rem]">
                <span className="shrink-0">Somos o</span>
                <span className="ml-[1.4375rem] h-[0.1875rem] min-w-0 flex-1 overflow-hidden bg-[#1a1a1a]" />
              </span>
              <span className="block max-w-full whitespace-nowrap font-agharti-bc-display text-[min(5rem,35cqw)] uppercase leading-none md:max-xl:text-[11.25rem] xl:text-[min(13.75rem,35cqw)]">
                GRUPO FAROL
              </span>
            </h2>
          </div>

          <div className="w-full whitespace-pre-wrap font-sans text-[1.125rem] italic leading-[1.2]">
            <p className="font-bold">A creator economy evoluiu. </p>
            <p className="mt-[1.35rem]">
              Creators construíram muito mais do que audiência.
              <br />
              Construíram comunidades, linguagem e universos próprios.
            </p>
            <p className="mt-[1.35rem]">
              No Farol, acreditamos no poder da{" "}
              <strong>conexão verdadeira. </strong>
              Quando creators participam desde o início das ideias,
              <br />o conteúdo se transforma.
            </p>
            <p className="mt-[1.35rem]">
              Deixa de ser apenas algo que se consome e passa a fazer{" "}
              <strong>parte da conversa, da cultura e da história</strong> que
              queremos contar juntos.
            </p>
            <p className="mt-[1.35rem]">
              Porque não estamos aqui só para vender posts.
              <br />
              <strong>Estamos aqui para construir histórias.</strong>
            </p>
          </div>
        </div>

        <div className="flex h-auto w-full shrink-0 flex-col items-end justify-between gap-[2rem] xl:h-full xl:w-[44.5625rem] xl:gap-0">
          <div className="flex w-full shrink-0 items-center">
            <div className="relative w-full aspect-video">
              <iframe
                src="https://drive.google.com/file/d/1YR_4ra6WmbTFCeN4_QtDLLJbRvZg-U3R/preview"
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                title="Grupo Farol manifesto"
              />
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col items-start gap-[2rem] md:max-xl:flex-row md:max-xl:items-center md:max-xl:justify-between md:max-xl:gap-0 xl:flex-row xl:items-center xl:justify-between xl:gap-0">
            {STATS.map((stat) => (
              <div
                key={stat.value + stat.color}
                className={`flex w-full shrink-0 items-center justify-center rounded-[1.5rem] px-[0.75rem] py-[1.875rem] md:max-xl:h-[12.609375rem] md:max-xl:w-auto xl:h-[16.8125rem] xl:w-auto xl:justify-start xl:px-[1rem] xl:py-[2.5rem] ${stat.mobileHeight}`}
                style={{ backgroundColor: stat.color }}
              >
                <div className="flex shrink-0 items-center justify-center gap-[1.171875rem] whitespace-nowrap text-center leading-none text-[#1a1a1a] md:max-xl:w-[7.828125rem] md:max-xl:flex-col xl:w-[10.4375rem] xl:flex-col xl:gap-[1.5625rem]">
                  <p className="font-agharti-buw-display text-[5.625rem] leading-none md:max-xl:w-full md:max-xl:text-[4.125rem] xl:w-full xl:text-[5.5rem]">
                    {stat.value}
                  </p>
                  <p className="font-foun-display text-[1.875rem] leading-none md:max-xl:w-full xl:w-full xl:text-[2.5rem]">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
