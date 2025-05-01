import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ProfileDataProvider } from "@/contexts/profileDataContext";
import { getAllProfileData } from "../db/functions/profile_data";
import { IProfile } from "@/types/IProfile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Area",
  description: "Modify data source",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  let profileData: IProfile|undefined
  try {
    profileData = await getAllProfileData(true)
  } catch(error) {
    // do nothing
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProfileDataProvider data={profileData}>
          <div className="bg-secondary-light dark:bg-primary-dark transition duration-300 min-h-screen">
            <div className="sm:container sm:mx-auto">
              <div className="mx-auto flex flex-col max-w-7xl items-center justify-between p-6 lg:px-8">
                {children}
              </div>
            </div>
          </div>
        </ProfileDataProvider>
      </body>
    </html>
  );
}
