type AboutProps = {
  imageUrl?: string;
};

const STATS = [
  {
    value: "+200",
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
    label: (
      <>
        PrOjetos
        <br />
        realizados
      </>
    ),
    color: "#5c8dc9",
  },
  {
    value: "+1000",
    label: (
      <>
        Clientes
        <br />E parceiros
      </>
    ),
    color: "#b1375b",
  },
];

export function About({ imageUrl }: AboutProps) {
  return (
    <section
      id="sobre"
      className="bg-[#fff2e7] px-[32px] py-[72px] text-[#1a1a1a] md:max-xl:px-[4rem] md:max-xl:py-[4.5rem] xl:px-[120px]"
    >
      <div className="flex w-full flex-col items-start gap-[40px] md:max-xl:h-auto md:max-xl:gap-[2.5rem] xl:h-[800px] xl:flex-row xl:gap-[105px]">
        <div className="flex h-auto w-full min-w-0 flex-col justify-start gap-[2rem] xl:h-full xl:flex-1 xl:justify-between">
          <div className="relative flex w-full flex-col items-start gap-[10px]">
            <h2 className="flex h-auto w-full flex-col justify-end whitespace-pre-wrap leading-none tracking-normal xl:h-[386.773px]">
              <span className="flex w-full items-center">
                <span className="shrink-0 font-agharti-lsc-display text-[3rem] md:max-xl:text-[clamp(4.5rem,10.417vw,5rem)] xl:text-[clamp(6rem,7.5vw,9rem)]">
                  SoMos o{" "}
                </span>
                <span className="ml-[1rem] h-[3px] w-[min(19.875rem,calc(100%-6.5rem))] bg-[#1a1a1a] md:max-xl:ml-[1.75rem] md:max-xl:w-[min(30.0625rem,calc(100%-10.25rem))] xl:ml-[4.375rem] xl:w-[clamp(140px,calc(100%-17.625rem),580px)]" />
              </span>
              <span className="font-agharti-bc-display text-[7.25rem] md:max-xl:text-[clamp(9.5rem,23.438vw,11.25rem)] xl:text-[clamp(11rem,13.75vw,16.5rem)]">
                GRUPO FAROL
              </span>
            </h2>
          </div>

          <div
            className="w-full whitespace-pre-wrap font-[var(--font-poppins)] text-[1.125rem] italic leading-[1.2] xl:text-[clamp(0.875rem,0.938vw,1.125rem)]"
          >
            <p className="font-bold">A creator economy evoluiu. </p>
            <p className="mt-[18px]">
              Creators construíram muito mais do que audiência.
              <br />
              Construíram comunidades, linguagem e universos próprios.
            </p>
            <p className="mt-[18px]">
              No Farol, acreditamos no poder da{" "}
              <strong>conexão verdadeira. </strong>
              Quando creators participam desde o início das ideias,
              <br />o conteúdo se transforma.
            </p>
            <p className="mt-[18px]">
              Deixa de ser apenas algo que se consome e passa a fazer{" "}
              <strong>parte da conversa, da cultura e da história</strong> que
              queremos contar juntos.
            </p>
            <p className="mt-[18px]">
              Porque não estamos aqui só para vender posts.
              <br />
              <strong>Estamos aqui para construir histórias.</strong>
            </p>
          </div>
        </div>

        <div
          className="flex h-auto w-full max-w-none shrink-0 flex-col items-end justify-between gap-[2rem] xl:h-full xl:w-[41.632%] xl:max-w-[713px] xl:gap-0"
          style={{ containerType: "inline-size" }}
        >
          <div className="relative h-[384px] w-full bg-[#d9d9d9] md:max-xl:aspect-[5/3] md:max-xl:h-auto xl:aspect-[713/384] xl:h-auto">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>

          <div className="flex w-full flex-col items-start gap-[32px] md:max-xl:flex-row md:max-xl:items-center md:max-xl:justify-between md:max-xl:gap-0 xl:flex-row xl:items-center xl:justify-between xl:gap-0">
            {STATS.map((stat) => (
              <div
                key={stat.value + stat.color}
                className={`flex w-full shrink-0 items-center justify-center rounded-[24px] px-[12px] py-[30px] md:max-xl:aspect-[199/269] md:max-xl:h-[12.609rem] md:max-xl:w-[9.328rem] md:max-xl:px-[0.75rem] md:max-xl:py-[1.875rem] xl:aspect-[199/269] xl:w-[27.91%] xl:justify-start xl:px-[2.244%] xl:py-[5.61%] ${
                  stat.value === "+200" ? "h-[126px]" : "h-[150px]"
                }`}
                style={{ backgroundColor: stat.color }}
              >
                <div className="flex w-auto items-center justify-center gap-[1.172rem] whitespace-nowrap text-center leading-none text-[#1a1a1a] md:max-xl:w-full md:max-xl:flex-col xl:w-full xl:flex-col xl:gap-[3.506cqw]">
                  <p className="font-agharti-buw-display text-[5.625rem] md:max-xl:w-full md:max-xl:text-[4.125rem] xl:w-full xl:text-[clamp(3rem,12.342cqw,5.5rem)]">
                    {stat.value}
                  </p>
                  <p
                    className="font-foun-display text-[1.875rem] leading-none md:max-xl:w-full xl:w-full xl:text-[clamp(1.5rem,5.61cqw,2.5rem)]"
                  >
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
