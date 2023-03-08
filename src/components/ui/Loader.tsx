import type { HTMLAttributes, ReactNode } from "react";

type LoaderProps = {
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const Loader = ({ className = "", children, ...props }: LoaderProps) => {
  return (
    <div
      aria-label="spinner progressbar"
      role="progressbar"
      className={`text-sm font-medium text-title md:text-base ${className}`}
      {...props}
    >
      {children ?? (
        <div aria-label="text progressbar" role="progressbar" className="pt-12">
          <div className="mx-auto w-max">
            <div className="h-16 w-16 animate-spin rounded-full border-t-[3px] border-b-[3px] border-black"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
