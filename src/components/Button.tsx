import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type ButtonProps = {
  intent: "primary" | "secondary" | "success" | "danger";
  children: ReactNode;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = ({ intent, children, className, ...btnProps }: ButtonProps) => {
  return (
    <button
      aria-label={`${intent} button`}
      className={`w-fit rounded-none px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-80 focus:outline-none active:opacity-100 md:text-sm ${
        intent === "primary"
          ? "bg-primary-700"
          : intent === "secondary"
          ? "bg-secondary"
          : intent === "success"
          ? "bg-success"
          : "bg-danger"
      } ${className}`}
      {...btnProps}
    >
      {children}
    </button>
  );
};

export default Button;
