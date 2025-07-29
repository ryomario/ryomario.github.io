'use client';

import { ITemplateProps } from "@/types/templates/ITemplate";
import TemplateDefault from "./default";
import { ThemeProvider } from "@emotion/react";
import { defaultTemplateTheme } from "@/types/templates/ITemplateTheme";
import { TemplateName } from "./registered";

type Props = ITemplateProps & {
  templateName: TemplateName;
};

export default function RenderTemplate({ templateName, ...rest }: Props) {
  return (
    <ThemeProvider theme={defaultTemplateTheme}>
      {
        templateName == TemplateDefault.name ? <TemplateDefault {...rest} />
          : <TemplateDefault {...rest} />
      }
    </ThemeProvider>
  );
}