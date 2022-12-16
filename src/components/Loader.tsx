import type { HTMLAttributes, ReactNode } from "react";

type LoaderProps = {
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const Loader = ({ className, children, ...props }: LoaderProps) => {
  return (
    <div
      aria-label="spinner progressbar"
      role="progressbar"
      className={`text-sm font-medium text-neutral-700 md:text-base ${className}`}
      {...props}
    >
      {children || "Loading..."}
    </div>
  );
};

export default Loader;
