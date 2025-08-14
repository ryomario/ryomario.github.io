'use client';

import { ITemplateProps } from "@/types/templates/ITemplate";
import { RenderTemplate } from ".";
import { useTemplatePageRouter } from "./hooks/templatePageRouter";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { useLocale } from "next-intl";
import { useSettingsContext } from "@/settings/settingsProvider";

type Props = ITemplateProps;

export default function TemplateProvider(props: Props) {
  const { state } = useSettingsContext();
  const { currentPage } = useTemplatePageRouter();
  const locale = useLocale();
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('$pageview', {
      page: currentPage,
      locale,
      settings: state,
    });
  }, [currentPage]);

  return <RenderTemplate templateName={state.templateName} {...props} />;
}