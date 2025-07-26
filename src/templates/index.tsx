'use client';

import { ITemplateProps } from "@/types/templates/ITemplate";
import TemplateDefault from "./default";
import { ThemeProvider } from "@emotion/react";
import { defaultTemplateTheme } from "@/types/templates/ITemplateTheme";

export const templates: Array<string> = [
  TemplateDefault.name,
];

type Props = ITemplateProps & {
  currentTemplate: number;
};

export default function RenderTemplate({ currentTemplate, ...rest }: Props) {
  // get active template name
  const templateName = templates[currentTemplate] ?? TemplateDefault.name;

  return (
    <ThemeProvider theme={defaultTemplateTheme}>
      {
        templateName == TemplateDefault.name ? <TemplateDefault {...rest}/>
        : <TemplateDefault {...rest}/>
      }
    </ThemeProvider>
  );
}