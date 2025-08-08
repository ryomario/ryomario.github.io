import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { styled } from "@mui/material/styles";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import ToggleButtonGroup, { toggleButtonGroupClasses, ToggleButtonGroupProps } from "@mui/material/ToggleButtonGroup";
import React from "react";
import { Controller, FieldValues, RegisterOptions, useFormContext } from "react-hook-form";

export type RHFToggleButtonGroupProps = ToggleButtonGroupProps & {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
  children: React.ReactNode;
  enforceValue?: boolean;
  spacing?: number;
  rules?: Omit<RegisterOptions<FieldValues, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
};

export function RHFToggleButtonGroup({
  name,
  label,
  children,
  helperText,
  enforceValue = false,
  rules,
  ...rest
}: RHFToggleButtonGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error }}) => (
        <FormControl error={!!error} fullWidth>
          {!!label && <FormLabel component="legend" sx={{ mb: 1 }}>{label}</FormLabel>}
          <StyledToggleButtonGroup
            {...field}
            fullWidth
            onChange={(_event, newValue) => {
              if(!enforceValue || newValue !== null) {
                field.onChange(newValue);
              } 
            }}
            exclusive
            {...rest}
            color={error ? 'error' : rest.color}
          >
            {children}
          </StyledToggleButtonGroup>
          {(error?.message || helperText) && (
            <FormHelperText sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {error?.message || helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

const StyledToggleButtonGroup = styled<(props: RHFToggleButtonGroupProps) => React.JSX.Element>(ToggleButtonGroup)(({ theme, spacing = 2 }) => ({
  gap: theme.spacing(spacing),
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
      borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
    },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
    },
  [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
    {
      borderLeft: `1px solid ${(theme.vars || theme).palette.action.disabledBackground}`,
    },
}));
