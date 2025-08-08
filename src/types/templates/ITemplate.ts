import { Locale } from "@/i18n/routing";
import React from "react";

export const ACTIVE_TEMPlATE_STORE_ID = 'ACTIVE_TEMPlATE_STORE_ID';

export type ITemplateProps = React.ComponentProps<'div'> & {
  defaultLocale?: Locale;
}