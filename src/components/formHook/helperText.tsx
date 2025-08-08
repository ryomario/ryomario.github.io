import FormHelperText, { FormHelperTextProps } from "@mui/material/FormHelperText";
import React from "react";

type Props = Omit<FormHelperTextProps, 'error'> & {
  errorMessage?: string;
  disableGutters?: boolean;
  helperText?: React.ReactNode;
}

export function HelperText({
  sx,
  helperText,
  errorMessage,
  disableGutters,
  ...rest
}: Props) {
  if(errorMessage || helperText) {
    return (
      <FormHelperText
        error={!!errorMessage}
        sx={[
          { mx: disableGutters ? 0 : 1.75 },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...rest}
      >
        {errorMessage || helperText}
      </FormHelperText>
    )
  }
}