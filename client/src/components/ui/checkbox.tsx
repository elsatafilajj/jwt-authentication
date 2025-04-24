import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { useField } from "formik";
import { cn } from "../../lib/utils";

function Checkbox({
  className,
  name,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const [field, meta] = useField(name);

  return (
    <div className="flex items-start">
      <CheckboxPrimitive.Root
        id={name}
        data-slot="checkbox"
        className={cn(
          "peer dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 flex items-center w-4 h-4 border border-green-300 rounded bg-green-100 focus:ring-green-500",
          className
        )}
        {...field}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="flex items-center justify-center text-current transition-none"
        >
          <CheckIcon className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {meta.touched && meta.error && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
}

export { Checkbox };
