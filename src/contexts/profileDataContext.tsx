"use client"

import { getAllProfileData } from "@/app/db/functions/profile_data";
import { EMPTY_PROFILE_DATA } from "@/factories/profileDataFactory";
import { IProfile } from "@/types/IProfile";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

const Context = createContext<{
  data: IProfile
  refresh: () => Promise<IProfile>
}>({
  data: EMPTY_PROFILE_DATA,
  refresh: async () => EMPTY_PROFILE_DATA
})

type Props = {
  data?: IProfile
} & PropsWithChildren

export function ProfileDataProvider({ children, data = EMPTY_PROFILE_DATA }: Props) {
  const [_data, _setData] = useState<IProfile>(data)

  const refresh = useCallback(async () => {
    const profileData = await getAllProfileData(true)
    _setData(profileData)
    return profileData
  },[_data, _setData])

  const value = useMemo(() => ({
    data: _data,
    refresh,
  }),[refresh,_data])
  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

export const useProfileData = () => {
  const { data } = useContext(Context)
  return data
}
export const useRefreshProfileData = () => {
  const { refresh } = useContext(Context)
  return refresh
}