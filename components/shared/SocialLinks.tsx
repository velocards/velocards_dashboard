import Facebook from "@/public/icons/Facebook";
import Skype from "@/public/icons/Skype";
import Twitter from "@/public/icons/Twitter";
import { IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";
import Link from "next/link";

const SocialLinks = () => {
  return (
    <ul className="flex gap-2 xxxl:gap-3">
      <li>
        <Link
          href="#"
          aria-label="social link"
          className="p-1 md:p-1.5 xxxl:p-2 hover:bg-primary hover:text-n0 duration-300 inline-flex text-primary rounded-full border border-primary">
          <Facebook size={22} />
        </Link>
      </li>
      <li>
        <Link
          href="#"
          aria-label="social link"
          className="p-1 md:p-1.5 xxxl:p-2 hover:bg-primary hover:text-n0 duration-300 inline-flex text-primary rounded-full border border-primary">
          <Twitter size={22} />
        </Link>
      </li>
      <li>
        <Link
          href="#"
          aria-label="social link"
          className="p-1 md:p-1.5 xxxl:p-2 hover:bg-primary hover:text-n0 duration-300 inline-flex text-primary rounded-full border border-primary">
          <Skype size={22} />
        </Link>
      </li>
      <li>
        <Link
          href="#"
          aria-label="social link"
          className="p-1 md:p-1.5 xxxl:p-2 hover:bg-primary hover:text-n0 duration-300 inline-flex text-primary rounded-full border border-primary">
          <IconBrandInstagram size={22} />
        </Link>
      </li>
      <li>
        <Link
          href="#"
          aria-label="social link"
          className="p-1 md:p-1.5 xxxl:p-2 hover:bg-primary hover:text-n0 duration-300 inline-flex text-primary rounded-full border border-primary">
          <IconBrandLinkedin size={22} />
        </Link>
      </li>
    </ul>
  );
};

export default SocialLinks;
