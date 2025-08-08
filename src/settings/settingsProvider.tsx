'use client';

import useLocalStorageState from "@/lib/storage/useLocalStorageState";
import { ISettingsContextValue, ISettingsState } from "@/types/ISettings";
import React, { createContext, useCallback, useContext, useMemo } from "react";

const SETTINGS_STORAGE_KEY = 'PORTOFOLIO_SETTINGS';

const SettingsDefaultState: ISettingsState = {
  colorScheme: 'light',
  miniSidebar: false,
}

const SettingsContext = createContext<ISettingsContextValue|undefined>(undefined)

type Props = React.PropsWithChildren & {
  defaultSettings?: ISettingsState
};

export function SettingsProvider({
  children,
  defaultSettings = SettingsDefaultState,
}: Props) {
  const [
    state,
    setState,
    { isPersistent, removeItem }
  ] = useLocalStorageState<ISettingsState>(
    SETTINGS_STORAGE_KEY,
    { defaultValue: defaultSettings }
  );

  const setField = useCallback((name: keyof ISettingsState, updateValue: Required<ISettingsState>[keyof ISettingsState]) => {
    setState(old => {
      const newState = {
        ...old,
        [name]: updateValue,
      }
      if(old[name] !== newState[name]) {
        return newState;
      } else {
        return old;
      }
    })
  },[setState]);

  const canReset = !isPersistent;

  const onReset = useCallback(
    () => {
      setState(defaultSettings);
    },
    [defaultSettings, setState]
  );

  const memoizedValue = useMemo<ISettingsContextValue>(
    () => ({
      canReset,
      onReset,
      setField,
      setState,
      state,
    }),
    [canReset, onReset, state, setState, setField]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);

  if(!context) {
    throw new Error('useSettingsContext must be used inside SettingsProvider');
  }

  return context;
}