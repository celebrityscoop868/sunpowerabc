"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

const FormFieldContext = React.createContext(null)
const FormItemContext = React.createContext(null)

const FormField = (props) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
)

const useFormField = () => {
  const field = React.useContext(FormFieldContext)
  const item = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(field.name, formState)

  return { ...fieldState, id: item.id }
}

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, id } = useFormField()
  return (
    <Label ref={ref} htmlFor={id} className={cn(error && "text-destructive", className)} {...props} />
  )
})

const FormControl = React.forwardRef((props, ref) => {
  const { id } = useFormField()
  return <Slot ref={ref} id={id} {...props} />
})

export { Form, FormField, FormItem, FormLabel, FormControl }
