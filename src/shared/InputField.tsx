import React, { FC } from "react"
import { twMerge } from "tailwind-merge"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  helper?: string
  value?: string
  label?: string
  helperClassName?: string
  labelClassName?: string
  className?: string
  type?: any
  labelMargin?: number
  readonly?: boolean
}

export const InputField: FC<InputProps> = React.forwardRef<
  HTMLInputElement,
  InputProps
>((props: InputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const {
    helper = "",
    label = "",
    type = "text",
    labelMargin = 0,
    disabled = false,
    helperClassName = "",
    labelClassName = "",
    className = "",
    readOnly,
    ...rest
  } = props

  return (
    <>
      {label !== "" && (
        <label
          className={twMerge(
            `block ${
              disabled ? "text-content-tertiary" : "text-content-secondary"
            } text-xs ${
              labelMargin > 0 && ` ml-[${labelMargin}px]`
            } font-medium mb-1`,
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        step="any"
        onWheel={(e) => type === "number" && e.currentTarget.blur()}
        className={className}
        readOnly={readOnly}
        ref={ref}
        {...rest}
      />
      {helper !== "" && (
        <p
          className={twMerge(
            "text-error text-xs ml-[12px] mt-1",
            helperClassName
          )}
        >
          {helper}
        </p>
      )}
    </>
  )
})

InputField.displayName = "InputField"
