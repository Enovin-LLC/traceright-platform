import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "bg-white text-slate-900 border-slate-200 placeholder:text-slate-400",
        "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500",
        "focus-visible:border-violet-500 focus-visible:ring-violet-500/20 focus-visible:ring-2",
        "dark:focus-visible:border-violet-400 dark:focus-visible:ring-violet-400/20",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
