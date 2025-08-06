import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { MouseEvent, MouseEventHandler, useCallback, useMemo } from "react";
import { UrlObject } from "url";

type UseTemplatePageRouterReturn = {
  currentPage: string;
  handlePageChange: (page?: string | null) => MouseEventHandler<HTMLElement>;
  getLinkHref: (page?: string | null, params?: Record<string, string|number>) => UrlObject;
  getParam: (key: string) => string | undefined;
}

const PAGE_KEY_PARAM = 'page';

export function useTemplatePageRouter(defaultPage = ''): UseTemplatePageRouterReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getParam = (key: string) => searchParams.get(key) ?? undefined;

  const currentPage = useMemo(() => searchParams.get(PAGE_KEY_PARAM) ?? defaultPage, [searchParams]);

  const handlePageChange = useCallback((page?: string | null) => {
    const handler: MouseEventHandler<HTMLElement> = (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      if (page === currentPage) return;

      let url = pathname;

      if (page && page != '/' && page != '') {
        const sp = new URLSearchParams(searchParams);
        sp.set(PAGE_KEY_PARAM, page);

        url = `${pathname}?${sp.toString()}`;
      }

      router.push(url);
    }

    return handler;
  }, [currentPage, defaultPage, searchParams, router, pathname]);

  const getLinkHref = useCallback((page?: string | null, params: Record<string, string|number> = {}): UrlObject => {
    const urlObj: UrlObject = {
      pathname,
    };
    const sp = new URLSearchParams();

    if (page && page != '/' && page != '') {
      sp.set(PAGE_KEY_PARAM, page);
    } else {
      sp.delete(PAGE_KEY_PARAM);
    }

    for (const key in params) {
      if (key !== PAGE_KEY_PARAM) {
        sp.set(key, `${params[key]}`);
      }
    }
    urlObj.search = sp.toString();

    return urlObj;
  }, [pathname]);
  
  return {
    getParam,
    currentPage,
    handlePageChange,
    getLinkHref,
  }
}