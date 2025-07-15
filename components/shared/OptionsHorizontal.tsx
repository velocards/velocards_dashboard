"use client";
import { IconDots } from "@tabler/icons-react";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import { useState } from "react";
const options = [
  {
    title: "Edit",
    url: "#",
  },
  {
    title: "Print",
    url: "#",
  },
  {
    title: "Share",
    url: "#",
  },
];
const OptionsHorizontal = () => {
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  const Content = () => {
    return (
      <ul className={`min-w-[150px] bg-n0 z-[3] dark:bg-bg3 p-1 rounded-md shadow-lg`}>
        {options.map(({ title, url }) => (
          <li key={title}>
            <Link href={url} className="py-2 leading-normal hover:bg-primary/5 hover:text-primary dark:hover:bg-bg3 text-sm rounded-md duration-300 block px-3">
              {title}
            </Link>
          </li>
        ))}
      </ul>
    );
  };
  return (
    <Tippy onClickOutside={hide} interactive={true} visible={visible} placement="bottom-start" content={<Content />}>
      <span>
        <IconDots size={18} onClick={visible ? hide : show} className="cursor-pointer" />
      </span>
    </Tippy>
  );
};

export default OptionsHorizontal;
