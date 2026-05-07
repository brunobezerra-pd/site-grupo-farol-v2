import type { ReactNode } from "react";

type WorkCard = {
  stamp: ReactNode;
  badgeLabel: string;
  color: string;
  body: ReactNode;
};

const WORK_CARDS: WorkCard[] = [
  {
    stamp: (
      <>
        EstRaTÉGiA &
        <br />
        INTELIGÊNCIA
      </>
    ),
    badgeLabel: "EstRaTÉGiA & INTELIGÊNCIA",
    color: "#d1d362",
    body: (
      <>
        Atuamos como uma consultoria criativa que identifica territórios culturais
        e constrói narrativas onde o talento faz parte da ideia desde o começo.
        Em vez de fórmulas prontas,{" "}
        <strong>
          desenvolvemos caminhos estratégicos para que a marca se torne parte
          orgânica da conversa.
        </strong>
      </>
    ),
  },
  {
    stamp: (
      <>
        CONEXões &
        <br />
        PARCERIAS
      </>
    ),
    badgeLabel: "CONEXões & PARCERIAS",
    color: "#d96837",
    body: (
      <>
        <strong>Articulamos relações verdadeiras entre marcas e talentos</strong>,
        fugindo da lógica de &quot;mídia de prateleira&quot;. Focamos na construção
        de <strong>parcerias de longo</strong> prazo onde a co-autoria garante a
        autenticidade do conteúdo.
      </>
    ),
  },
  {
    stamp: (
      <>
        Projetos
        <br />
        Especiais
      </>
    ),
    badgeLabel: "Projetos Especiais",
    color: "#e5a545",
    body: (
      <>
        Desenvolvemos formatos e narrativas proprietárias que{" "}
        <strong>transformam briefings em histórias que permanecem.</strong>{" "}
        Criamos projetos sob medida onde a conexão entre marca e criador é o que{" "}
        <strong>gera impacto real no público.</strong>
      </>
    ),
  },
  {
    stamp: (
      <>
        Excelência
        <br />
        no Craft
      </>
    ),
    badgeLabel: "Excelência no Craft",
    color: "#90c2ac",
    body: (
      <>
        Nossa execução une{" "}
        <strong>técnica audiovisual e alma criativa</strong>. Cuidamos de todo o
        processo, do roteiro à direção, garantindo que o resultado final tenha o{" "}
        <strong>rigor técnico e a sensibilidade narrativa</strong> que o mercado de
        conteúdo exige.
      </>
    ),
  },
];

export function HowWeWork() {
  return (
    <section
      id="como-trabalhamos"
      className="bg-[#fff2e7] px-[32px] py-[72px] text-[#1a1a1a] md:max-xl:px-[4rem] md:max-xl:py-[4.5rem] xl:px-[clamp(5rem,6.25vw,7.5rem)] xl:py-[clamp(4rem,3.75vw,4.5rem)]"
    >
      <div className="flex w-full flex-col items-start gap-[2rem]">
        <div className="flex w-full flex-col items-center">
          <div className="relative z-10 mb-[-2rem] flex h-[3.185rem] w-full items-center justify-center md:max-xl:mb-[-2.875rem] md:max-xl:h-[3.555rem] xl:mb-[-5.25rem] xl:h-[6.77rem]">
            <p
              className="w-full rotate-[1.51deg] text-center font-casual-human-display text-[clamp(2rem,8.5vw,2.5rem)] leading-none xl:text-[clamp(2.667rem,3.333vw,4rem)]"
            >
              COMO TRABaLHaMOS
            </p>
          </div>

          <div className="relative flex w-full items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[2.153rem] h-[6.57rem] w-[min(24.889rem,calc(100vw-4rem))] max-w-none -translate-x-1/2 rotate-[0.9deg] bg-[#e5a545] md:max-xl:top-[3.293rem] md:max-xl:h-[10.24rem] md:max-xl:w-[38.793rem] xl:top-[23.7%] xl:h-[14.651rem] xl:w-[55.499rem] xl:max-w-[52.86vw]"
            />
            <div className="relative flex h-[9.206rem] w-[min(24.928rem,calc(100vw-4rem))] items-center justify-center md:max-xl:h-[14.094rem] md:max-xl:w-[38.123rem] xl:h-[21.286rem] xl:w-auto">
              <h2 className="rotate-[2.84deg] whitespace-nowrap text-center font-agharti-demi-display text-[clamp(5.5rem,20vw,6.5rem)] leading-none md:max-xl:text-[clamp(10rem,25.521vw,12.25rem)] xl:text-[clamp(12.333rem,15.417vw,18.5rem)]">
                COM MARCAS
              </h2>
            </div>
          </div>
        </div>

        <p className="w-full text-center font-heading text-[1.5rem] italic leading-normal md:max-xl:text-[2rem] xl:text-[clamp(1.5rem,1.667vw,2rem)]">
          Um processo estruturado que combina{" "}
          <strong className="font-bold">
            curadoria humana, visão estratégica e execução impecável.
          </strong>
        </p>
      </div>

      <div
        className="grid w-full grid-cols-1 gap-y-[2.5rem] py-[2rem] md:max-xl:gap-y-[6rem] md:max-xl:px-[1.75rem] md:max-xl:pb-[2rem] md:max-xl:pt-[8rem] xl:grid-cols-2 xl:gap-x-[clamp(5rem,6.25vw,7.5rem)] xl:gap-y-[clamp(5rem,5vw,6rem)] xl:pb-[2rem] xl:pl-0 xl:pt-[clamp(6rem,6.667vw,8rem)]"
      >
        {WORK_CARDS.map((card) => (
          <article
            key={`${card.color}-${String(card.stamp)}`}
            className="relative flex w-full flex-col items-start justify-start gap-[1rem] justify-self-stretch rounded-[2.5rem] border-4 border-black bg-[#fff2e7] p-[2rem] md:max-xl:w-[35.8125rem] md:max-xl:items-center md:max-xl:justify-center md:max-xl:justify-self-center md:max-xl:px-[4.5rem] md:max-xl:pb-[2rem] md:max-xl:pt-[3.5rem] xl:w-full xl:max-w-[45.067rem] xl:items-center xl:justify-center xl:px-[clamp(3rem,3.75vw,4.5rem)] xl:pb-[2rem] xl:pt-[clamp(2rem,2.917vw,3.5rem)]"
          >
            <div
              className="relative flex shrink-0 items-center justify-center rounded-[99px] px-[1rem] pb-[0.5rem] pt-[0.125rem] md:absolute md:left-[-5.125rem] md:top-[-5.1875rem] md:size-[9.375rem] md:rounded-full md:p-[0.625rem] xl:left-[clamp(-5.125rem,-4.271vw,-3.75rem)] xl:top-[clamp(-5.188rem,-4.323vw,-3.75rem)] xl:size-[clamp(7.5rem,7.813vw,9.375rem)]"
              style={{
                backgroundColor: card.color,
              }}
            >
              <p
                className="whitespace-nowrap text-center font-agharti-regular-display text-[1.5rem] leading-normal text-[#1a1a1a] md:rotate-[-20.07deg] md:font-agharti-duc-display md:text-[3rem] md:leading-[0.951] xl:text-[clamp(2.4rem,2.5vw,3rem)]"
              >
                <span className="md:hidden">{card.badgeLabel}</span>
                <span className="hidden md:inline">{card.stamp}</span>
              </p>
            </div>

            <p
              className="w-full font-[var(--font-poppins)] text-[1rem] italic leading-normal md:max-xl:text-[1.67475rem] xl:text-[clamp(1.25rem,1.396vw,1.67475rem)]"
            >
              {card.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
