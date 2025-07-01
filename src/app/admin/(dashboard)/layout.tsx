import { AuthGuard } from "@/auth/AuthGuard";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { IDashboardNavData } from "@/types/ILayout";
import React from "react";

import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonPinRoundedIcon from '@mui/icons-material/PersonPinRounded';
import FilterFramesRoundedIcon from '@mui/icons-material/FilterFramesRounded';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { AdminRoute } from "@/types/EnumAdminRoute";
import { Metadata } from "next";
import { ProfileDataProvider } from "@/contexts/profileDataContext";
import RepoProfileData from "@/db/repositories/RepoProfileData";

export const metadata: Metadata = {
  title: "Dashboard Admin - Web Portofolio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profileData = await RepoProfileData.getAll(true)
  
  return (
    <AuthGuard>
      <ProfileDataProvider data={profileData}>
        <DashboardLayout slotProps={{ nav: { data: navData }}}>
          {children}
        </DashboardLayout>
      </ProfileDataProvider>
    </AuthGuard>
  );
}

const navData: IDashboardNavData = [
  {
    subheader: '',
    items: [
      {
        icon: <DashboardIcon/>,
        title: 'Dashboard',
        path: AdminRoute.DASHBOARD,
      }
    ],
  },
  {
    subheader: 'Templates',
    items: [
      {
        icon: <PersonPinRoundedIcon/>,
        title: 'CV',
        path: AdminRoute.CV,
      },
      {
        icon: <FilterFramesRoundedIcon/>,
        title: 'Portofolio',
        path:  AdminRoute.PORTOFOLIO,
      }
    ],
  },
  {
    subheader: 'User data',
    items: [
      {
        icon: <PersonIcon/>,
        title: 'Profile',
        path:  AdminRoute.PROFILE,
      },
      {
        icon: <WorkIcon/>,
        title: 'Work Experience',
        path:  AdminRoute.WORK,
      },
      {
        icon: <SchoolIcon/>,
        title: 'Education',
        path:  AdminRoute.EDUCATION,
      },
      {
        icon: <WorkspacePremiumIcon/>,
        title: 'License',
        path:  AdminRoute.LICENSE,
      }
    ],
  },
]