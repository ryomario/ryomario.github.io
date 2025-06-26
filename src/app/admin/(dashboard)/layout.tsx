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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <DashboardLayout slotProps={{ nav: { data: navData }}}>
        {children}
      </DashboardLayout>
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
        path: '/admin/dashboard',
      }
    ],
  },
  {
    subheader: 'Templates',
    items: [
      {
        icon: <PersonPinRoundedIcon/>,
        title: 'CV',
        path: '/admin/cv',
      },
      {
        icon: <FilterFramesRoundedIcon/>,
        title: 'Portofolio',
        path: '/admin/portofolio',
      }
    ],
  },
  {
    subheader: 'User data',
    items: [
      {
        icon: <PersonIcon/>,
        title: 'Profile',
        path: '/admin/profile',
      },
      {
        icon: <WorkIcon/>,
        title: 'Work Experience',
        path: '/admin/work',
      },
      {
        icon: <SchoolIcon/>,
        title: 'Education',
        path: '/admin/education',
      },
      {
        icon: <WorkspacePremiumIcon/>,
        title: 'License',
        path: '/admin/license',
      }
    ],
  },
]