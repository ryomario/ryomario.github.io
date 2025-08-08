import React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";

export type FormProps = {
  onSubmit?: () => void;
  children: React.ReactNode;
  methods: UseFormReturn<any>;
}

export function Form({ children, onSubmit, methods }: FormProps) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">{children}</form>
    </FormProvider>
  )
}