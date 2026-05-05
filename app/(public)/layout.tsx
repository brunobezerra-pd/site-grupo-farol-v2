import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { getSettings } from "@/lib/settings";

export const revalidate = 60;

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { script_head, script_body, script_footer } = await getSettings([
    "script_head",
    "script_body",
    "script_footer",
  ]);

  return (
    <>
      {script_head ? (
        <head dangerouslySetInnerHTML={{ __html: script_head }} />
      ) : null}
      {script_body ? (
        <div dangerouslySetInnerHTML={{ __html: script_body }} />
      ) : null}
      <Header />
      {children}
      <Footer scriptFooter={script_footer} />
    </>
  );
}
