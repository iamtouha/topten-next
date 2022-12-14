import React from "react";

type ButtonProps = {
  intent: "primary" | "secondary" | "success" | "danger";
  text: string;
  onClick?: (() => void) | (() => Promise<undefined>);
};

const Button = ({ intent, text, onClick }: ButtonProps) => {
  return (
    <button
      aria-label={`${intent} button`}
      className={`w-fit rounded-md px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80 focus:outline-none active:opacity-100 ${
        intent === "primary"
          ? "bg-primary"
          : intent === "secondary"
          ? "bg-secondary"
          : intent === "success"
          ? "bg-success"
          : "bg-danger"
      }`}
      onClick={() => onClick && onClick()}
    >
      {text}
    </button>
  );
};

export default Button;
