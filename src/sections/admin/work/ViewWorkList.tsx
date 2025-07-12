'use client';

import { AdminWorkList } from "@/components/admin/work/adminWorkList";
import { AdminWorkSearch } from "@/components/admin/work/adminWorkSearch";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IWorkExperience } from "@/types/IWorkExperience";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

// const DATA_WORKS: IWorkExperience[] = [
//   {
//     id: 1,
//     companyName: 'PT Solusi Kampus Indonesia (eCampuz)',
//     jobTitle: 'Web Developer',
//     description: 'Work with SQL and PHP, using JQuery for the web client script. Join in the application development using NextJS. Work with SQL and PHP, using JQuery for the web client script. Join in the application development using NextJS.',
//     employmentType: WorkEmploymentType.CONTRACT,
//     location: [
//       'Jl. Pandega Marta No.771, Pogung Lor, Sinduadi, Kec. Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55284, Indonesia',
//       'Yogyakarta'
//     ],
//     skills: [],
//     startDate_month: 10,
//     startDate_year: 2023,
//   },
//   {
//     id: 2,
//     companyName: 'PT. Stechoq Robotika Indonesia',
//     jobTitle: 'Software Engineer',
//     description: '',
//     employmentType: WorkEmploymentType.INTERNSHIP,
//     location: ['Special Region of Yogyakarta, Indonesia'],
//     skills: [],
//     startDate_month: 7,
//     startDate_year: 2022,
//     endDate_month: 11,
//     endDate_year: 2022,
//   }
// ];

type Props = {
  data: IWorkExperience[];
}

export function ViewWorkList({ data }: Props) {
  const redirectPath = (id: string) => `${AdminRoute.WORK_VIEW}/${id}`;
  const redirectPathEdit = (id: string) => `${AdminRoute.WORK_EDIT}/${id}`;

  const renderFilters = () => (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-end', sm: 'center' },
      }}
    >
      <AdminWorkSearch redirectPath={redirectPath}/>
    </Box>
  );

  return <>
    <Stack spacing={2} sx={{ mb: 3 }}>
      {renderFilters()}
    </Stack>

    <AdminWorkList
      data={data}
      getRedirectPathDetails={redirectPath}
      getRedirectPathEdit={redirectPathEdit}
    />
  </>;
}