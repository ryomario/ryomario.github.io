"use client"

import { IWorkExperience, IWorkExperienceFilter } from "@/types/IWorkExperience";
import { filterWorks } from "@/utils/works";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

const Context = createContext<{
  data: IWorkExperience[];
  locations: IWorkExperience['location'];
  skills: IWorkExperience['skills'];
  update: (value: IWorkExperience[],locations: IWorkExperience['location'],skills: IWorkExperience['skills']) => void;
}|null>(null);

type Props = {
  data?: IWorkExperience[];
  locations?: IWorkExperience['location'];
  skills?: IWorkExperience['skills'];
} & PropsWithChildren

export function WorksProvider({ children, data = [], locations = [], skills = [], }: Props) {
  const [_data, _setData] = useState<IWorkExperience[]>(data);
  const [_locations, _setLocations] = useState<IWorkExperience['location']>(locations);
  const [_skills, _setSkills] = useState<IWorkExperience['skills']>(skills);

  const update = useCallback((value: IWorkExperience[],locations: IWorkExperience['location'],skills: IWorkExperience['skills']) => {
    _setData(value);
    _setLocations(locations);
    _setSkills(skills);
  },[_setData,_setLocations,_setSkills]);

  const value = useMemo(() => ({
    data: _data,
    locations: _locations,
    skills: _skills,
    update,
  }),[update,_data,_locations,_skills]);
  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

export const useWorks = (filter: IWorkExperienceFilter = {}) => {
  const { data } = useWorksContext();
  return filterWorks(data, filter);
}
export const useWorksWithPagination = ({
  page = 1,
  perPage = 10,
  filter = {},
}: {
  page?: number
  perPage?: number
  filter?: IWorkExperienceFilter
}) => {
  const { data } = useWorksContext();

  const filteredData = filterWorks(data, filter);
  const total = filteredData.length;
  const totalPage = !total ? 1 : Math.ceil(total / perPage);
  const startIdx = perPage * (page - 1);
  const endIdx = startIdx + perPage;
  const paginatedData = filteredData.slice(startIdx, endIdx);

  return {
    total,
    totalPage,
    data: paginatedData,
    startNum: !total ? 0 : startIdx + 1,
    lastNum: startIdx + paginatedData.length,
  }
}
export const useWorksContext = () => {
  const ctx = useContext(Context);
  if(!ctx) {
    throw new Error('call useWorksContext inside WorksProvider!');
  }
  return ctx;
}