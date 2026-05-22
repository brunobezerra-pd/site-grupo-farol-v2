import type { Metadata } from "next";

import { About } from "@/components/public/About";
import { AboutV2 } from "@/components/public/AboutV2";
import { Creators } from "@/components/public/Creators";
import { CTA } from "@/components/public/CTA";
import { Hero } from "@/components/public/Hero";
import { HeroV2 } from "@/components/public/HeroV2";
import { HowWeWork } from "@/components/public/HowWeWork";
import { Partners } from "@/components/public/Partners";
import { TalentsMarquee } from "@/components/public/TalentsMarquee";
import { getHeroMediaItems } from "@/lib/hero-media";
import { getPartners } from "@/lib/partners";
import { getSettings } from "@/lib/settings";
import { getTalentsForMarquee } from "@/lib/talents";

const SETTINGS_KEYS = [
  "hero_version",
  "about_version",
  "hero_button_enabled",
  "hero_button_label",
  "hero_button_url",
  "contact_button_label",
  "contact_button_url",
  "talents_button_enabled",
  "marquee_count",
  "seo_title",
  "seo_description",
  "og_image_url",
];

function isEnabled(value: string) {
  return value === "true" || value === "1" || value === "yes";
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://grupofarol.com")
  );
}

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings([
    "seo_title",
    "seo_description",
    "og_title",
    "og_description",
    "og_image_url",
  ]);

  const title = settings.seo_title || "Grupo Farol";
  const description =
    settings.seo_description ||
    "A maior agencia de creators da America Latina.";
  const ogTitle = settings.og_title || title;
  const ogDescription = settings.og_description || description;
  const ogImage = settings.og_image_url;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
      siteName: "Grupo Farol",
      type: "website",
      url: getSiteUrl(),
    },
  };
}

export default async function HomePage() {
  const settings = await getSettings(SETTINGS_KEYS);
  const marqueeCount = Number.parseInt(settings.marquee_count || "10", 10);
  const heroVersion = settings.hero_version === "v2" ? "v2" : "v1";
  const aboutVersion = settings.about_version === "v2" ? "v2" : "v1";

  const [talents, partners, heroMediaItems] = await Promise.all([
    getTalentsForMarquee(Number.isFinite(marqueeCount) ? marqueeCount : 10),
    getPartners(),
    heroVersion === "v2" ? getHeroMediaItems() : Promise.resolve([]),
  ]);

  return (
    <main className="bg-[#fff2e7] text-[#1a1a1a]">
      {heroVersion === "v2" ? (
        <HeroV2 mediaItems={heroMediaItems} />
      ) : (
        <Hero
          buttonEnabled={isEnabled(settings.hero_button_enabled)}
          buttonLabel={settings.hero_button_label || "Conheca nossos creators"}
          buttonUrl={settings.hero_button_url || "/casting"}
        />
      )}
      {aboutVersion === "v2" ? <AboutV2 /> : <About />}
      <Creators />
      <TalentsMarquee talents={talents} />
      <HowWeWork />
      <Partners partners={partners} />
      <CTA
        contactButtonLabel={settings.contact_button_label || "Fale com o Farol"}
        contactButtonUrl={settings.contact_button_url || "mailto:contato@grupofarol.com"}
        showTalentsButton={isEnabled(settings.talents_button_enabled)}
      />
    </main>
  );
}
