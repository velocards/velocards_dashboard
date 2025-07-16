import cn from "@/utils/cn";
import Link from "next/link";
import ModeSwitcher from "./ModeSwitcher";
import Notification from "./Notification";
import Profile from "./Profile";
import BalanceDisplay from "./BalanceDisplay";
import MobileMenu from "./MobileMenu";
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
          <div className="flex items-center gap-2 sm:gap-4 xxl:gap-6">
            <button onClick={() => setSidebarIsOpen(!sidebarIsOpen)} aria-label="sidebar-toggle-btn" className="flex items-center rounded-s-2xl bg-primary px-0.5 py-2.5 sm:py-3 text-xl text-n0" id="sidebar-toggle-btn">
              <i className="las la-angle-left text-base sm:text-lg"></i>
            </button>
            <Link href="/dashboard" className="flex items-center shrink-0">
              <VeloCardsLogoWithText showTagline={true} alignment="bottom" className="scale-75 sm:scale-100 origin-left" />
            </Link>
          </div>
          
          {/* Right side items */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 xxl:gap-6 ml-auto">
            <div className="hidden sm:block">
              <BalanceDisplay />
            </div>
            <div className="hidden sm:block">
              <ModeSwitcher />
            </div>
            <Notification />
            <Profile />
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
