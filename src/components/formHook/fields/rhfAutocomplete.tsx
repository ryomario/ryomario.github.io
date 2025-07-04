import { parseJSON_safe, toJSON_safe } from "@/lib/json";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, FieldValues, RegisterOptions, useFormContext } from "react-hook-form";

type AutocompleteBaseProps = Omit<
  AutocompleteProps<any, boolean, boolean, boolean>,
  'renderInput'|'options'
>;

type AutocompleteOptionType = {
  key: string;
  label: string;
  isNew?: boolean;
}

export type RHFAutocompleteProps = AutocompleteBaseProps & {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  optionsKey?: string;
  defaultOptions?: string[];
  slotProps?: AutocompleteBaseProps['slotProps'] & {
    textField?: TextFieldProps;
  };
  rules?: Omit<RegisterOptions<FieldValues, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
};

export function RHFAutocomplete({
  name,
  label,
  helperText,
  slotProps,
  placeholder,
  optionsKey = 'RHFAutocompleteOptions',
  defaultOptions,
  rules,
  ...rest
}: RHFAutocompleteProps) {
  const { control, setValue, watch } = useFormContext();

  const value = watch(name);

  const [selected, setSelected] = useState<AutocompleteOptionType|AutocompleteOptionType[]|null>(transformValue(value));

  const { textField, ...restSlotProps } = slotProps ?? {};

  const [options, setOptions] = useState<AutocompleteOptionType[]>(() => {
    const savedJson = sessionStorage.getItem(optionsKey);
    const savedData = parseJSON_safe<AutocompleteOptionType[]>(savedJson,[]);
    const data = savedData ?? [];
    if(defaultOptions) {
      data.unshift(...defaultOptions.map(key => ({ key, label: key })));
    }
    return data.filter((d, i, arr) => arr.findIndex(a => a.key === d.key) == i);
  });

  const addOption = useCallback((option: AutocompleteOptionType) => {
    setOptions(oldOptions => {
      if(!option || oldOptions.findIndex(opt => opt.key === option.key) !== -1) {
        return oldOptions;
      }

      const newOptions = [...oldOptions, {...option, isNew: false}];

      sessionStorage.setItem(optionsKey, toJSON_safe(newOptions, '[]'));
      
      return newOptions;
    })
  },[options,setOptions]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error }}) => (
        <Autocomplete
          {...field}
          id={`rhf-autocomplete-${name}`}
          options={options}
          value={selected}
          onChange={(event, newValue) => {
            setSelected(newValue);
            setValue(name, transformValueOnChange(newValue), { shouldValidate: true, shouldDirty: true });
            if(Array.isArray(newValue)) {
              newValue.forEach(v => addOption(v));
            } else {
              addOption(newValue);
            }
          }}
          isOptionEqualToValue={(option, value) => option.key == value.key}
          getOptionLabel={(option) => {
            if(Array.isArray(option)) return '';
            return option.isNew ? `Add "${option.label}"` : option.label
          }}
          filterOptions={(options, params) => {
            const filtered = options.filter((option) =>
              (option.key || option).toLowerCase().includes(params.inputValue.toLowerCase())
            );
            
            if (params.inputValue !== '' && !options.some(option => 
              (option.key || option).toLowerCase() === params.inputValue.toLowerCase()
            )) {
              filtered.push({
                key: params.inputValue,
                label: params.inputValue,
                isNew: true,
              });
            }

            return filtered;
          }}
          renderValue={(value, getItemProps) => Array.isArray(value) ? value.map((option, index) => (
            <Chip
              label={option.key}
              {...getItemProps({ index })}
              key={option.key}
            />
          )) : value.key}
          renderInput={(params) => (
            <TextField
              {...params}
              {...textField}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message ?? helperText}
              slotProps={{
                ...textField?.slotProps,
                htmlInput: {
                  ...params.inputProps,
                  autoComplete: 'new-password',
                  ...textField?.slotProps?.htmlInput,
                },
              }}
            />
          )}
          {...rest}
          {...restSlotProps}
        />
      )}
    />
  );
}

const transformValue = (value: string|string[]): AutocompleteOptionType|AutocompleteOptionType[] => {
  if(typeof value === 'string') {
    return {
      key: value,
      label: value,
    };
  }

  return value.map(key => ({ key, label: key }));
}

const transformValueOnChange = (value: AutocompleteOptionType|AutocompleteOptionType[]): string|string[] => {
  if(Array.isArray(value)) {
    return value.map(v => v.key ?? v);
  }

  if(!value) {
    return '';
  }

  return value.key ?? value;
}