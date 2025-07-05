import Box, { BoxProps } from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { useEffect } from "react";
import { FieldArrayWithId, FieldValues, RegisterOptions, useFieldArray, UseFieldArrayReturn, useFormContext } from "react-hook-form";

type RenderInputParam = Omit<UseFieldArrayReturn, 'fields'> & {
  index: number;
  field: FieldArrayWithId;
}

export type RHFArrayProps = BoxProps & {
  name: string;
  label?: string;
  defaultValue?: any[];
  renderInput: (params: RenderInputParam) => React.ReactNode;
  helperText?: React.ReactNode;
  rules?: Omit<RegisterOptions<FieldValues, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
};

export function RHFArray({
  name,
  label,
  renderInput,
  helperText,
  defaultValue = [],
  rules,
  ...rest
}: RHFArrayProps) {
  const { control, formState: { errors } } = useFormContext();

  const { fields, ...arrayField } = useFieldArray({
    name,
    control,
    rules,
  });

  useEffect(() => {
    if(defaultValue.length && !fields.length) {
      defaultValue.forEach(value => {
        arrayField.append(value);
      })
    }
  },[fields])

  const errorMessage = errors[name]?.message ?? errors[name]?.root?.message

  return (
    <Box
      width="100%"
      {...rest}
    >
      {!!label && <FormLabel component="legend" sx={{ mb: 1 }} error={!!errorMessage}>{label}</FormLabel>}
      {fields.map((field, index) => renderInput({ field, index, ...arrayField }))}
      {(errorMessage || helperText) && (
        <FormHelperText error={!!errorMessage} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {errorMessage?.toString() ?? helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

const emptyParams: RenderInputParam = {
  field: { id: '0' },
  index: 0,
  append: () => {},
  insert: () => {},
  move: () => {},
  prepend: () => {},
  remove: () => {},
  replace: () => {},
  swap: () => {},
  update: () => {},
}