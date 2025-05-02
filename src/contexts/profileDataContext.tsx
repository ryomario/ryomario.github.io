"use client"

import RepoProfileData from "@/db/repositories/RepoProfileData";
import { EMPTY_PROFILE_DATA } from "@/factories/profileDataFactory";
import { IProfile } from "@/types/IProfile";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

const Context = createContext<{
  data: IProfile
  update: (data: IProfile) => void
}>({
  data: EMPTY_PROFILE_DATA,
  update: (data: IProfile) => {},
})

type Props = {
  data?: IProfile
} & PropsWithChildren

export function ProfileDataProvider({ children, data = EMPTY_PROFILE_DATA }: Props) {
  const [_data, _setData] = useState<IProfile>(data)

  const update = useCallback((profileData: IProfile) => {
    _setData(profileData)
  },[_setData])

  const value = useMemo(() => ({
    data: _data,
    update,
  }),[update,_data])
  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

export const useProfileData = () => {
  const { data } = useContext(Context)
  return data
}
export const useUpdateProfileData = () => {
  const { update } = useContext(Context)
  return update
}