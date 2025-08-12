'use client'

import { useEffect } from "react"

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useTemplatePageRouter } from "@/templates/hooks/templatePageRouter"
import { useLocale } from "next-intl"
import { useActiveTemplate } from "@/templates/hooks/useActiveTemplate"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const { templateName } = useActiveTemplate();
  const { currentPage } = useTemplatePageRouter();

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      defaults: '2025-05-24',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing();
      },
    });
  }, []);

  useEffect(() => {
    posthog.capture('$pageview', {
      page: currentPage,
      locale,
      templateName,
    });
  }, [currentPage]);

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
