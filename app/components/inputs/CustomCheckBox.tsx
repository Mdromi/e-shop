"use client";

import { FieldValues, UseFormRegister } from "react-hook-form";

interface CustomCheckBoxProps {
  id: string;
  label: string;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
  id,
  label,
  disabled,
  register,
}) => {
  return (
    <div className="w-full flex flex-row gap-2 items-center s">
      <input
        type="checkbox"
        id={id}
        disabled={disabled}
        placeholder=""
        {...register(id)}
        className="cursor-pointer"
      />
      <label htmlFor={id} className="font-medium cursor-pointer">{label}</label>
    </div>
  );
};

export default CustomCheckBox;
