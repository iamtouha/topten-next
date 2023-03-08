import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { forwardRef } from "react";
import DotsLoading from "./DotsLoading";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  loadingVariant?: "spinner" | "dots";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      isLoading = false,
      loadingVariant = "spinner",
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={`flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm transition-opacity hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-[0.99] active:bg-opacity-100 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 ${className} ${
          variant === "primary"
            ? "bg-primary-700 text-white"
            : variant === "secondary"
            ? "bg-slate-50 text-slate-900"
            : "bg-transparent hover:bg-slate-800 active:bg-slate-700"
        }`}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          loadingVariant === "spinner" ? (
            <Loader2 className="mr-2 aspect-square w-4 animate-spin" />
          ) : (
            <DotsLoading />
          )
        ) : null}
        {isLoading
          ? loadingVariant === "spinner"
            ? "Loading..."
            : null
          : props.children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
