'use client';

import React, { useEffect, useState } from "react";
import { useAuthContext } from "./AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { SplashScreen } from "@/components/loadingScreen/SplashScreen";
import { AdminRoute } from "@/types/EnumAdminRoute";

export function AuthGuard({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  const { authenticated, authenticating } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const createRedirectPath = (path: string) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${path}?${queryString}`;
  }

  const checkPermission = async () => {
    if(authenticating) {
      return;
    }

    if(!authenticated) {
      const redirectPth = createRedirectPath(AdminRoute.LOGIN);
      router.replace(redirectPth);
      return;
    }

    setIsChecking(false);
  }

  useEffect(() => {
    checkPermission();
  },[authenticated, authenticating]);

  if(isChecking) {
    return <SplashScreen/>;
  }

  return children;
}