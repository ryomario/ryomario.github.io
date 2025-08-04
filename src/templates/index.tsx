'use client';

import { ITemplateProps } from "@/types/templates/ITemplate";
import { useSettingsContext } from "@/settings/settingsProvider";
import TemplateDefault from "./default";

type Props = ITemplateProps;

export default function RenderTemplate(props: Props) {
  const { state } = useSettingsContext();

  switch(state.templateName) {
    case 'default': return <TemplateDefault {...props} />;
    default: return <TemplateDefault {...props} />;
  }
}