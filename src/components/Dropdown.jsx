import React, { forwardRef, useImperativeHandle } from "react";

const Dropdown = ({ options, onChange }, ref) => {
  useImperativeHandle(ref, () => ({
    // Function to get the selected value
    getValue() {
      return selectRef.current.value;
    },
  }));

  const selectRef = React.createRef();

  return (
    <select ref={selectRef} onChange={onChange}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default forwardRef(Dropdown);
