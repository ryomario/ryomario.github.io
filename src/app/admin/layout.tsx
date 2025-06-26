import "../globals.css";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "@/auth/AuthProvider";
import { SettingsProvider } from "@/settings/settingsProvider";
import { ThemeProvider } from "@/theme/themeProvider";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: "Admin Area - Web Portofolio",
  description: "Modify data to the latest version",
  icons: [
    {
      rel: 'icon',
      url: '/icon.svg',
    }
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if(process.env.NODE_ENV == 'production') {
    return notFound();
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <SettingsProvider>
            <AppRouterCacheProvider options={{ key: 'css' }}>
              <ThemeProvider>
                <NextTopLoader showSpinner={false}/>
                {children}
              </ThemeProvider>
            </AppRouterCacheProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
