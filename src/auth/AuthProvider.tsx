'use client';

import { IAuthContextValue } from "@/types/IAuth";
import { checkIsLoggedIn } from "@/utils/auth";
import { Logger } from "@/utils/logger";
import { usePathname } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext<IAuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState({authenticated: false, loading: true});
  const pathname = usePathname();

  const checkUserSession = useCallback(
    async () => {
      try {
        const isLoggedIn = await checkIsLoggedIn();

        if(!isLoggedIn) {
          throw Error('unauthorized');
        }

        setState({ authenticated: true, loading: false });
      } catch (error: any) {
        Logger.debug(error.message || error || 'unknown error', 'AuthProvider > checkUserSession');
        setState({ authenticated: false, loading: false });
      }
    }
    ,
    [setState]
  );

  useEffect(() => {
    // executed on every pathname change
    checkUserSession();
  },[pathname]);

  const memoizedValue = useMemo<IAuthContextValue>(() => ({
    authenticated: state.authenticated,
    authenticating: state.loading,
    checkUserSession,
  }),[state, checkUserSession]);
  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const data = useContext(AuthContext);

  if(!data) {
    throw Error('useAuthContext: Context must be used inside AuthProvider');
  }

  return data;
}