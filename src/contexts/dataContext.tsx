"use client"

import { IProfile } from "@/types/IProfile";
import { IProject } from "@/types/IProject";
import { createContext, PropsWithChildren, useContext } from "react";

type ContextValue = {
  data: {
    profile: IProfile;
    projects: IProject[];
  };
  refs: {
    project_tags: IProject['tags'];
  };
};

const Context = createContext<ContextValue | null>(null);

type Props = {
  value: ContextValue;
} & PropsWithChildren

export function DataProvider({ children, value }: Props) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useDataContext = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('useData only available inside DataProvider component!');
  return ctx;
}