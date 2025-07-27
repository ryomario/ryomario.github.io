import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Locale, routing } from "@/i18n/routing";
import "flag-icons";
import { ThemeModeLoader } from "@/components/themeModeLoader";
import NextTopLoader from "nextjs-toploader";
import { ScrollTop } from "@/components/scrollTop";
import { ScrollToTop } from "@/components/scrollToTop";
import { ProfileDataProvider } from "@/contexts/profileDataContext";
import RepoProfileData from "@/db/repositories/RepoProfileData";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export const metadata: Metadata = {
  metadataBase: new URL('https://ryomario.github.io'),
  title: "Mario's Portofolio",
  description: "Web Portofolio from Mario",
  keywords: "portofolio, developer, web developer",
  twitter: {
    card: "summary_large_image",
    title: "Mario's Portofolio",
    description: "Web Portofolio from Mario",
  }
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale)

  const messages = await getMessages()

  const profileData = await RepoProfileData.getAll()

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.className} ${geistSans.variable} ${geistMono.variable}`}
      >
        <ThemeModeLoader />
        <NextIntlClientProvider messages={messages}>
          <ScrollTop />
          <ProfileDataProvider data={profileData}>
            <Suspense>
              {children}
            </Suspense>
          </ProfileDataProvider>
        </NextIntlClientProvider>
        <ScrollToTop />
        <NextTopLoader
          showSpinner={false}
        />
      </body>
    </html>
  );
}
