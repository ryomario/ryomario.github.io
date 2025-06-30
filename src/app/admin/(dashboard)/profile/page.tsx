import { ViewProfile } from "@/components/admin/profile/ViewProfile";
import { IProfileForm } from "@/types/IProfile";

export default async function Page() {
  const profileData: IProfileForm = {
    hireable: true,
    profile_picture: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    headline: '',
  }

  return <ViewProfile defaultValues={profileData}/>
}
