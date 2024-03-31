import React, { FC } from "react";
import { twMerge } from "tailwind-merge";
import { ButtonProps, ButtonSize, ButtonVariant } from "./Button.d";
import * as Icons from "../assets/icons";

const getButtonSizeStyles = (size: ButtonSize, variant: ButtonVariant) => {
  switch (size) {
    case "medium":
      return `px-6 text-button font-semibold gap-x-2 ${
        variant === "gradient" ? "py-1.5" : "py-2"
      }`;
    case "small":
      return `px-2 text-button-sm font-medium gap-x-1 ${
        variant === "gradient" ? "py-[3px]" : "py-[5px]"
      }`;
    default:
      return null;
  }
};

const getButtonIconStyles = (size: ButtonSize) => {
  switch (size) {
    case "medium":
      return `text-base`;
    case "small":
      return `text-sm`;
    default:
      return null;
  }
};

const getButtonVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case "link":
      return "bg-zebec-card-background-primary flex items-center gap-2 rounded-md border border-zebec-card-outline";
    case "secondary":
      return "bg-zebec-card-background-primary hover:bg-zebec-card-background-secondary border border-zebec-card-outline";
    case "default":
      return `bg-zebec-card-primary hover:bg-zebec-card-primary-dark text-zebec-card-content-primary`;
    case "gradient":
      return `primary-gradient-border focus:outline-0`;
    case "danger":
      return `bg-zebec-card-error focus:outline-0`;
    default:
      return null;
  }
};

export const Button: FC<ButtonProps> = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    props: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ): JSX.Element => {
    const {
      children,
      title,
      size = "medium",
      variant = "default",
      className,
      startIcon,
      endIcon,
      loading,
      disabled,
      type,
      ...rest
    } = props;

    const sizeStyles = getButtonSizeStyles(size, variant);
    const iconSizeStyles = getButtonIconStyles(size);
    const variantStyles = getButtonVariantStyles(variant);

    return (
      <>
        <button
          className={twMerge(
            `${
              disabled ? "opacity-60" : ""
            } rounded-lg whitespace-nowrap focus:outline-none focus:border-zebec-card-outline-none transition duration-300 text-content-primary disabled:cursor-not-allowed ${variantStyles}`,
            className ?? ""
          )}
          {...rest}
          ref={ref}
          disabled={disabled}
          type={type ? type : "submit"}
        >
          {children ? (
            children
          ) : (
            <div className={`flex items-center justify-center ${sizeStyles}`}>
              {startIcon && (
                <span className={`${iconSizeStyles}`}>{startIcon}</span>
              )}
              {title}
              {endIcon && (
                <span className={`${iconSizeStyles}`}>{endIcon}</span>
              )}
              {loading && (
                <span className={`${iconSizeStyles}`}>
                  <img src={Icons.Loading} />
                </span>
              )}
            </div>
          )}
        </button>
      </>
    );
  }
);

Button.displayName = "Button";
