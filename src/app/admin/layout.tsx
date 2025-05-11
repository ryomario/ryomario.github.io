import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ProfileDataProvider } from "@/contexts/profileDataContext";
import { IProfile } from "@/types/IProfile";
import { FormProfileData } from "@/components/admin/forms/formProfileData";
import { AdminTabLink } from "@/components/admin/tabs/adminTab";
import { notFound } from "next/navigation";
import RepoProfileData from "@/db/repositories/RepoProfileData";
import NextTopLoader from "nextjs-toploader";

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
  if(process.env.NODE_ENV == 'production') {
    return notFound();
  }
  
  let profileData: IProfile|undefined
  try {
    profileData = await RepoProfileData.getAll(true)
  } catch {
    // do nothing
  }

  const isMissingProfile = !profileData || (
    !profileData.name || profileData.name == ''
    || !profileData.downloadCV || profileData.downloadCV == ''
    || typeof profileData.hireable != 'boolean'
    || !(profileData.lastUpdated instanceof Date)
    || !profileData.socialLinks.codepen || profileData.socialLinks.codepen == ''
    || !profileData.socialLinks.github || profileData.socialLinks.github == ''
    || !profileData.socialLinks.linkedin || profileData.socialLinks.linkedin == ''
    || !profileData.socialLinks.website || profileData.socialLinks.website == ''
  )


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProfileDataProvider data={profileData}>
          <div className="bg-secondary-light dark:bg-primary-dark transition duration-300 min-h-screen">
            <div className="sm:container sm:mx-auto">
              <div className="mx-auto flex flex-col max-w-7xl items-center justify-between p-6 lg:px-8">
                {isMissingProfile ? <FormProfileData/> : <>
                  <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                        <li className="me-2" role="presentation">
                          <AdminTabLink label="Profile" href="/admin"/>
                        </li>
                        <li className="me-2" role="presentation">
                          <AdminTabLink label="Projects" href="/admin/projects"/>
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-80" role="tabpanel">
                      {children}
                    </div>
                  </div>
                </>}
              </div>
            </div>
          </div>
        </ProfileDataProvider>
        <NextTopLoader
          showSpinner={false}
        />
      </body>
    </html>
  );
}
