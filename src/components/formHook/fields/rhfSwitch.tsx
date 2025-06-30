import Box, { BoxProps } from "@mui/material/Box";
import FormControlLabel, { FormControlLabelProps } from "@mui/material/FormControlLabel";
import { FormHelperTextProps } from "@mui/material/FormHelperText";
import Switch, { SwitchProps } from "@mui/material/Switch";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { HelperText } from "../helperText";

export type RHFSwitchProps = Omit<FormControlLabelProps, 'control'> & {
  name: string;
  helperText?: React.ReactNode;
  slotProps?: {
    wrapper?: BoxProps;
    switch?: SwitchProps;
    helperText?: FormHelperTextProps;
  };
}

export function RHFSwitch({
  sx,
  name,
  helperText,
  label,
  slotProps,
  ...rest
}: RHFSwitchProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box {...slotProps?.wrapper}>
          <FormControlLabel
            label={label}
            control={
              <Switch
                {...field}
                checked={field.value}
                {...slotProps?.switch}
                slotProps={{
                  input: {
                    id: `${name}-switch`,
                    ...(!label && { 'aria-label': `${name} switch` }),
                    ...slotProps?.switch?.slotProps?.input,
                  }
                }}
              />
            }
            sx={[{ mx: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
            {...rest}
          />

          <HelperText
            {...slotProps?.helperText}
            errorMessage={error?.message}
            helperText={helperText}
          />
        </Box>
      )}
    />
  )
}