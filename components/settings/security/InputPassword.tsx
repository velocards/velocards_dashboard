"use client";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";

const InputPassword = ({
  placeholder,
  defaultvalue,
  id
}: {
  placeholder: string;
  defaultvalue?: string;
  id: string;
}) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className=" bg-primary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 relative">
      <input
        type={showPass ? "text" : "password"}
        className="w-11/12 text-sm bg-transparent"
        placeholder={placeholder}
        id={id}
        defaultValue={defaultvalue ? defaultvalue : ""}
        required
      />
      <span
        onClick={() => setShowPass(!showPass)}
        className="absolute ltr:right-5 rtl:left-5 top-1/2 -translate-y-1/2 cursor-pointer">
        {showPass ? <IconEye /> : <IconEyeOff />}
      </span>
    </div>
  );
};

export default InputPassword;
