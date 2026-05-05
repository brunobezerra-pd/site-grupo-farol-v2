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
    <section id="sobre" className="bg-[#fff2e7] px-[120px] py-[72px] text-[#1a1a1a]">
      <div className="flex h-[800px] w-full items-start gap-[105px]">
        <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
          <div className="relative flex w-full flex-col items-start gap-[10px]">
            <h2 className="flex h-[386.773px] w-full flex-col justify-end whitespace-pre-wrap leading-none tracking-normal">
              <span className="flex w-full items-center">
                <span
                  className="shrink-0 font-agharti-lsc-display"
                  style={{ fontSize: "clamp(6rem, 7.5vw, 9rem)" }}
                >
                  SoMos o{" "}
                </span>
                <span
                  className="ml-[4.375rem] h-[3px] bg-[#1a1a1a]"
                  style={{
                    width: "clamp(140px, calc(100% - 17.625rem), 580px)",
                  }}
                />
              </span>
              <span
                className="font-agharti-bc-display"
                style={{ fontSize: "clamp(11rem, 13.75vw, 16.5rem)" }}
              >
                GRUPO FAROL
              </span>
            </h2>
          </div>

          <div
            className="w-full whitespace-pre-wrap font-[var(--font-poppins)] italic leading-[1.2]"
            style={{ fontSize: "clamp(0.875rem, 0.938vw, 1.125rem)" }}
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
          className="flex h-full w-[41.632%] max-w-[713px] shrink-0 flex-col items-end justify-between"
          style={{ containerType: "inline-size" }}
        >
          <div className="relative aspect-[713/384] w-full bg-[#d9d9d9]">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>

          <div className="flex w-full items-center justify-between">
            {STATS.map((stat) => (
              <div
                key={stat.value + stat.color}
                className="flex aspect-[199/269] w-[27.91%] shrink-0 items-center rounded-[24px] px-[2.244%] py-[5.61%]"
                style={{ backgroundColor: stat.color }}
              >
                <div className="flex w-full flex-col items-center justify-center gap-[3.506cqw] text-center leading-none text-[#1a1a1a]">
                  <p
                    className="w-full font-agharti-buw-display"
                    style={{ fontSize: "clamp(3rem, 12.342cqw, 5.5rem)" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="w-full font-foun-display leading-none"
                    style={{
                      fontSize: "clamp(1.5rem, 5.61cqw, 2.5rem)",
                    }}
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
