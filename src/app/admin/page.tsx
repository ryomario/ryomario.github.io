import { AdminRoute } from '@/types/EnumAdminRoute';
import { permanentRedirect } from 'next/navigation';

export default async function Page() {
  return permanentRedirect(AdminRoute.DASHBOARD);
}
