import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Locale, routing } from "@/i18n/routing";
import "flag-icons";
import NextTopLoader from "nextjs-toploader";
import { ScrollTop } from "@/components/scrollTop";
import RepoProfileData from "@/db/repositories/RepoProfileData";
import { DataProvider } from "@/contexts/dataContext";
import RepoProjects from "@/db/repositories/RepoProjects";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@/theme/themeProvider";
import { SettingsProvider } from "@/settings/settingsProvider";
import { getActiveTemplate, getTemplateTheme } from "@/templates/registered";
import { Suspense } from "react";
import { PostHogProvider } from "@/contexts/posthogProvider";

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
  const { locale, ...other } = await params
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale)

  // get active template
  const templateName = await getActiveTemplate()
  const messages = await getMessages()

  const profileData = await RepoProfileData.getAll()
  const projects = await RepoProjects.getAll()
  const project_tags = await RepoProjects.getAllTags()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <PostHogProvider>
          <SettingsProvider defaultSettings={{ templateName, colorScheme: 'light' }}>
            <NextIntlClientProvider messages={messages}>
              <ScrollTop />
              <DataProvider value={{
                data: {
                  profile: profileData,
                  projects,
                },
                refs: {
                  project_tags,
                }
              }}>
                <AppRouterCacheProvider options={{ key: 'css' }}>
                  <ThemeProvider theme={getTemplateTheme(templateName)}>
                    <NextTopLoader showSpinner={false} />
                    <Suspense>
                      {children}
                    </Suspense>
                  </ThemeProvider>
                </AppRouterCacheProvider>
              </DataProvider>
            </NextIntlClientProvider>
          </SettingsProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
