import cn from "@/utils/cn";
import Link from "next/link";
import ModeSwitcher from "./ModeSwitcher";
import Notification from "./Notification";
import Profile from "./Profile";
import BalanceDisplay from "./BalanceDisplay";
import { Dispatch, SetStateAction } from "react";
import { VeloCardsLogoWithText } from "@/components/icons/VeloCardsLogo";
type Props = {
  sidebarIsOpen: boolean;
  setSidebarIsOpen: Dispatch<SetStateAction<boolean>>;
};
export default function Topbar({ sidebarIsOpen, setSidebarIsOpen }: Props) {
  return (
    <nav className={cn("navbar-top topbarfull z-20 gap-3 border-b bg-n0 dark:bg-bg4 border-n0 py-3 shadow-sm duration-300 dark:border-n700 xl:py-4 xxxl:py-6", sidebarIsOpen ? "topbarmargin" : "topbarfull")} id="topbar">
      <div className="topbar-inner">
        <div className="flex items-center justify-between px-3 sm:px-4 xxxl:px-6">
          <div className="flex items-center gap-4 xxl:gap-6">
            <Link href="/" className="topbar-logo hidden shrink-0">
              <VeloCardsLogoWithText showTagline={false} alignment="center" />
            </Link>
            <button onClick={() => setSidebarIsOpen(!sidebarIsOpen)} aria-label="sidebar-toggle-btn" className="flex items-center rounded-s-2xl bg-primary px-0.5 py-3 text-xl text-n0" id="sidebar-toggle-btn">
              <i className="las la-angle-left text-lg"></i>
            </button>
          </div>
          
          {/* Right side items */}
          <div className="flex items-center gap-3 sm:gap-4 xxl:gap-6 ml-auto">
            <BalanceDisplay />
            <ModeSwitcher />
            <Notification />
            <Profile />
          </div>
        </div>
      </div>
    </nav>
  );
}
