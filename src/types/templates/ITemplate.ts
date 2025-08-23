import { Locale } from "@/i18n/routing";
import React from "react";

export type ITemplateProps = React.ComponentProps<'div'> & {
  defaultLocale?: Locale;
}