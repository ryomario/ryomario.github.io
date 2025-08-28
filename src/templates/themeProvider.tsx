'use client';

import { useSettingsContext } from "@/settings/settingsProvider";
import { ThemeProvider } from "@/theme/themeProvider";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { getTemplateTheme, TemplateName, templates } from "./registered";
import { useSearchParams } from "next/navigation";

export default function TemplateThemeProvider({ children }: PropsWithChildren) {
  const settings = useSettingsContext();
  const searchParams = useSearchParams();

  const theme = useMemo(() => getTemplateTheme(settings.state.templateName ?? 'default'), [settings.state.templateName]);

  useEffect(() => {
    const tmpl = searchParams.get('tmpl') as TemplateName | null;
    // don't change template if not in development
    if (process.env.NODE_ENV != 'development' || !tmpl || !templates.includes(tmpl)) {
      return;
    }

    settings.setState({ templateName: tmpl });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}