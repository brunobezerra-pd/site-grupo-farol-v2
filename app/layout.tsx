import type { Metadata } from "next";
import { PT_Serif, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Grupo Farol",
  description: "A maior agência de creators da América Latina.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${ptSerif.variable} h-full antialiased`}
    >
      <head>
        {/* OneTrust Cookies Consent Notice start for www.grupofarol.com */}
        <Script
          src="https://cdn.cookielaw.org/consent/01981dc3-9c51-7be6-90fe-6f86459257f9/OtAutoBlock.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          data-domain-script="01981dc3-9c51-7be6-90fe-6f86459257f9"
          strategy="beforeInteractive"
        />
        <Script id="onetrust-optanon" strategy="beforeInteractive">
          {`
            function OptanonWrapper() { }
          `}
        </Script>
        {/* OneTrust Cookies Consent Notice end for www.grupofarol.com */}
      </head>
      <body className="min-h-full flex flex-col">
        {/* OneTrust Privacy Notice start */}
        {/* Language Drop-down element that will control in which language the Privacy Notice is displayed */}
        <div className="ot-privacy-notice-language-dropdown-container"></div>
        {/* Container in which the Privacy Notice will be rendered */}
        <div id="otnotice-7ff5ac78-34ab-4ca8-b07e-bbd87de39677" className="otnotice"></div>

        <Script
          {...{
            src: "https://privacyportal-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js",
            id: "otprivacy-notice-script",
            strategy: "afterInteractive",
            settings: "eyJjYWxsYmFja1VybCI6Imh0dHBzOi8vcHJpdmFjeXBvcnRhbC5vbmV0cnVzdC5jb20vcmVxdWVzdC92MS9wcml2YWN5Tm90aWNlcy9zdGF0cy92aWV3cyIsImNvbnRlbnRBcGlVcmwiOiJodHRwczovL3ByaXZhY3lwb3J0YWwub25ldHJ1c3QuY29tL3JlcXVlc3QvdjEvZW50ZXJwcmlzZXBvbGljeS9kaWdpdGFscG9saWN5L2NvbnRlbnQiLCJtZXRhZGF0YUFwaVVybCI6Imh0dHBzOi8vcHJpdmFjeXBvcnRhbC5vbmV0cnVzdC5jb20vcmVxdWVzdC92MS9lbnRlcnByaXNlcnBvbGljeS9kaWdpdGFscG9saWN5L21ldGEtZGF0YSJ9"
          } as Record<string, string>}
        />

        <Script id="ot-privacy-notice-init" strategy="afterInteractive">
          {`
            if (window.OneTrust && window.OneTrust.NoticeApi) {
              window.OneTrust.NoticeApi.Initialized.then(function() {
                window.OneTrust.NoticeApi.LoadNotices(["https://privacyportal-cdn.onetrust.com/storage-container/73dca12b-5ba4-4937-9072-b5ffa15d1ba7/privacy-notices/7ff5ac78-34ab-4ca8-b07e-bbd87de39677/published/privacynotice.json"]);
              });
            } else {
              window.addEventListener('load', function() {
                if (window.OneTrust && window.OneTrust.NoticeApi) {
                  window.OneTrust.NoticeApi.Initialized.then(function() {
                    window.OneTrust.NoticeApi.LoadNotices(["https://privacyportal-cdn.onetrust.com/storage-container/73dca12b-5ba4-4937-9072-b5ffa15d1ba7/privacy-notices/7ff5ac78-34ab-4ca8-b07e-bbd87de39677/published/privacynotice.json"]);
                  });
                }
              });
            }
          `}
        </Script>
        {/* OneTrust Privacy Notice end */}
        {children}
      </body>
    </html>
  );
}

