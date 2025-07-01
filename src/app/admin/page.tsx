import { AdminRoute } from '@/types/EnumAdminRoute';
import { redirect } from 'next/navigation';

export default function Page() {
  redirect(AdminRoute.DASHBOARD);
}
