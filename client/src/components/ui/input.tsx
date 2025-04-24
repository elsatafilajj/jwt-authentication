import * as React from "react";
import { cn } from "../../lib/utils";
import { useField } from "formik";

type CommonProps = {
  name: string;
  label?: string;
  className?: string;
};

type TextareaProps = CommonProps & {
  isTextArea: true;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type TextInputProps = CommonProps & {
  isTextArea?: false;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

type Props = TextareaProps | TextInputProps;

export function Input(props: Props) {
  const { name, label, className, isTextArea = false, ...rest } = props;
  const [field, meta] = useField(name);

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-green-900"
        >
          {label}
        </label>
      )}

      {isTextArea ? (
        <textarea
          id={name}
          data-slot="input"
          className={cn(
            "bg-green-100 border border-green-300 text-green-900 placeholder-green-600 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 w-full p-2.5 shadow-xs outline-none transition-[color,box-shadow]",
            className
          )}
          {...field}
          {...(rest as TextareaProps)}
        />
      ) : (
        <input
          id={name}
          type={(rest as TextInputProps).type || "text"}
          data-slot="input"
          className={cn(
            "bg-green-100 border border-green-300 text-green-900 placeholder-green-600 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 w-full p-2.5 shadow-xs outline-none transition-[color,box-shadow]",
            className
          )}
          {...field}
          {...(rest as TextInputProps)}
        />
      )}

      {meta.touched && meta.error && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
