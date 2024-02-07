import React, { useId } from "react";

const InputField = React.forwardRef(function Input(
  { label, type = "text", className = "", onChange, ...props },
  ref // this is the thing which provide us reference
) {
  const id = useId();
  return (
    <div className="w-full text-left">
      {label && (
        <label
          className="inline-block mb-1 pl-1 font-serif text-xl"
          htmlFor={props.id || id}
        >
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          className={`px-3 py-2 rounded-lg bg-white text-black outline-none
           focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
          ref={ref}
          onChange={onChange}
          {...props}
          id={props.id || id}
        />
      ) : (
        <input
          className={`px-3 py-2 rounded-lg bg-white text-black outline-none
           focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
          type={type}
          ref={ref}
          onChange={onChange}
          {...props}
          id={props.id || id}
        />
      )}
    </div>
  );
});

export default InputField;
