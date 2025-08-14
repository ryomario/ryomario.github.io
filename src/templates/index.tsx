import { ITemplateProps } from "@/types/templates/ITemplate";
import TemplateDefault from "./default";
import { TemplateName } from "./registered";

type Props = ITemplateProps & {
  templateName?: TemplateName;
};

export function RenderTemplate({ templateName, ...props }: Props) {
  switch (templateName) {
    case 'default': return <TemplateDefault {...props} />;
    default: return <TemplateDefault {...props} />;
  }
}