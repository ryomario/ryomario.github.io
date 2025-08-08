import { TemplateName } from '@/templates/registered';
import type { SupportedColorScheme } from '@mui/material/styles'

export interface ISettingsState {
  colorScheme?: SupportedColorScheme;
  miniSidebar?: boolean;
  templateName?: TemplateName;
}

export interface ISettingsContextValue {
  state: ISettingsState;
  canReset: boolean;
  onReset: () => void;
  setState: (updateValue: Partial<ISettingsState>) => void;
  setField: (name: keyof ISettingsState, updateValue: Required<ISettingsState>[keyof ISettingsState]) => void;
}