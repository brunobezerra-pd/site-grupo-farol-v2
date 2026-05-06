import type { ReactNode } from "react";

type WorkCard = {
  stamp: ReactNode;
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
        className="grid w-full grid-cols-1 gap-y-[6rem] pb-[2rem] pl-[5.125rem] pt-[8rem] md:max-xl:px-[1.75rem] xl:grid-cols-2 xl:gap-x-[clamp(5rem,6.25vw,7.5rem)] xl:gap-y-[clamp(5rem,5vw,6rem)] xl:pl-0 xl:pt-[clamp(6rem,6.667vw,8rem)]"
      >
        {WORK_CARDS.map((card) => (
          <article
            key={`${card.color}-${String(card.stamp)}`}
            className="relative flex w-[min(21rem,calc(100vw-9.25rem))] max-w-none items-center justify-center justify-self-start rounded-[2.5rem] border-4 border-black bg-[#fff2e7] px-[clamp(3rem,15vw,4.5rem)] pb-[2rem] pt-[3.5rem] md:max-xl:w-[35.8125rem] md:max-xl:justify-self-center md:max-xl:px-[4.5rem] xl:w-full xl:max-w-[45.067rem] xl:px-[clamp(3rem,3.75vw,4.5rem)] xl:pt-[clamp(2rem,2.917vw,3.5rem)]"
          >
            <p
              className="w-full font-[var(--font-poppins)] text-[1.25rem] italic leading-normal md:max-xl:text-[1.67475rem] xl:text-[clamp(1.25rem,1.396vw,1.67475rem)]"
            >
              {card.body}
            </p>

            <div
              className="absolute left-[-5.125rem] top-[-5.1875rem] flex size-[9.375rem] items-center justify-center rounded-full p-[0.625rem] xl:left-[clamp(-5.125rem,-4.271vw,-3.75rem)] xl:top-[clamp(-5.188rem,-4.323vw,-3.75rem)] xl:size-[clamp(7.5rem,7.813vw,9.375rem)]"
              style={{
                backgroundColor: card.color,
              }}
            >
              <p
                className="rotate-[-20.07deg] whitespace-nowrap text-center font-agharti-duc-display text-[3rem] leading-[0.951] xl:text-[clamp(2.4rem,2.5vw,3rem)]"
              >
                {card.stamp}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
