import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const baseStyles =
      "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50";

    const colorStyles = error
      ? "border-red-500 focus-visible:border-red-500"
      : "border-[#0F4C75] focus-visible:border-[#0F4C75]";

    return (
      <input
        type={type}
        className={cn(baseStyles, colorStyles, className)}
        aria-invalid={Boolean(error) || undefined}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
