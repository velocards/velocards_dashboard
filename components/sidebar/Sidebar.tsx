import { sidebarData } from "@/public/data/sidebarData";
import cn from "@/utils/cn";
import { useLayout } from "@/utils/LayoutContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { layoutlist } from "../topbar/SelectLayout";
import TierInfo from "./BalanceAndTier";
import { VeloCardsLogoWithText } from "@/components/icons/VeloCardsLogo";
type Props = {
  sidebarIsOpen: boolean;
  setSidebarIsOpen: Dispatch<SetStateAction<boolean>>;
};
export default function Sidebar({ sidebarIsOpen, setSidebarIsOpen }: Props) {
  const { layout } = useLayout();
  const [activeMenu, setActiveMenu] = useState("");
  const path = usePathname();

  useEffect(() => {
    if (window.innerWidth > 1200) {
      setSidebarIsOpen(true);
    } else {
      setSidebarIsOpen(false);
    }
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setSidebarIsOpen(false);
      } else {
        setSidebarIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    layoutlist.forEach((layout) => document.body.classList.remove(layout));

    document.body.classList.add(layout.toLowerCase());
  }, [layout]);

  useEffect(() => {
    // Reset active menu first
    setActiveMenu("");
    
    // Find the active menu based on current path
    sidebarData.forEach(({ items }) => {
      items.forEach(({ submenus, name }) => {
        if (submenus) {
          // Check if current path matches any submenu URL
          const isActive = submenus.some(({ url }) => url === path);
          if (isActive) {
            setActiveMenu(name);
          }
        }
      });
    });
  }, [path]);

  return (
    <aside className={cn("sidebar", sidebarIsOpen ? "sidebarshow" : "sidebarhide")}>
      <div className="sidebar-inner relative">
        <div className="logo-column">
          <div className="logo-container">
            <div className="logo-inner">
              <Link href="/" className="logo-wrapper">
                <VeloCardsLogoWithText showTagline={true} alignment="center" />
              </Link>
              <button onClick={() => setSidebarIsOpen(false)} className="sidebar-close-btn xl:hidden">
                <i className="las la-times"></i>
              </button>
            </div>
          </div>
          <div className="menu-container pb-28">
            {/* Main Navigation Section */}
            {sidebarData.filter(section => section.id === 1).map(({ id, items }) => (
              <div key={id} className={cn("menu-wrapper", layout == "horizontal" && "hidden")}>
                <ul className="menu-ul">
                  {items.map(({ id, icon, name, submenus, url }) =>
                    submenus ? (
                      <li key={id} className="menu-li">
                        <button onClick={() => setActiveMenu((p) => (p == name ? "" : name))} className={cn("menu-btn group", activeMenu == name && "active")}>
                          <span className="flex items-center justify-center gap-2">
                            <span className="menu-icon">{icon}</span>
                            <span className="menu-title font-medium">{name}</span>
                          </span>
                          <span className="plus-minus">
                            <i className="las la-plus text-xl"></i>
                            <i className="las la-minus text-xl"></i>
                          </span>
                          <span className="chevron-down hidden">
                            <i className="las la-angle-down text-base"></i>
                          </span>
                        </button>
                        <ul className={cn("submenu", activeMenu == name ? "submenu-show" : "submenu-hide")}>
                          {submenus.map(({ title, url }, index) => (
                            <li key={index}>
                              <Link href={url} className={cn("submenu-link", path === url && "text-primary")}>
                                <i className="las la-minus text-xl"></i>
                                <span>{title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li key={id} className="menu-li">
                        <Link href={url} className={cn("menu-link", path == url && "active")}>
                          {icon}
                          <span>{name}</span>
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
            
            {/* Tier Information Component */}
            <TierInfo />

          </div>
        </div>
      </div>
    </aside>
  );
}
