"use client";
import useDropdown from "@/utils/useDropdown";
import { IconLifebuoy, IconLogout, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { toast } from "react-toastify";
import { useEffect } from "react";
export const profileLinks = [
  {
    icon: <IconUser size={18} />,
    url: "/settings/profile",
    title: "My Profile",
  },
  {
    icon: <IconLifebuoy size={18} />,
    url: "/support/help-center",
    title: "Help",
  },
  {
    icon: <IconLogout size={18} />,
    url: "/auth/sign-in",
    title: "Logout",
  },
];
const Profile = () => {
  const { open, ref, toggleOpen } = useDropdown();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();
  
  // Fetch profile data on mount
  useEffect(() => {
    if (user && !profile) {
      fetchProfile();
    }
  }, [user]);
  
  // Use profile data if available, fallback to auth user data
  const displayName = profile 
    ? `${profile.firstName} ${profile.lastName}` 
    : user 
    ? `${user.firstName} ${user.lastName}` 
    : 'Loading...';
    
  const displayEmail = profile?.email || user?.email || 'Loading...';
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/auth/sign-in");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };
  
  return (
    <div className="relative shrink-0" ref={ref}>
      <div className="cursor-pointer size-10 md:size-[50px] rounded-full bg-primary f-center hover:bg-primary/90 transition-colors" onClick={toggleOpen}>
        <i className="las la-user-circle text-2xl md:text-3xl text-n0"></i>
      </div>
      <div className={`bg-n0 z-20  dark:bg-bg4 ltr:origin-top-right rtl:origin-top-left rounded-md ltr:right-0 rtl:left-0 shadow-[0px_6px_30px_0px_rgba(0,0,0,0.08)] absolute top-full duration-300 ${open ? "visible opacity-100 scale-100" : "invisible opacity-0 scale-0"}`}>
        <div className="flex flex-col text-center items-center lg:p-4 p-3 border-b dark:border-n500">
          <div className="size-[60px] rounded-full bg-primary f-center">
            <i className="las la-user-circle text-4xl text-n0"></i>
          </div>
          <h6 className="h6 mt-2">{displayName}</h6>
          <span className="text-sm">{displayEmail}</span>
          {/* Email Verification Status */}
          {((user as any)?.emailVerified) ? (
            <span className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
              <i className="las la-check-circle"></i>
              Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 mt-2 text-xs text-yellow-600 dark:text-yellow-400">
              <i className="las la-exclamation-circle"></i>
              Unverified
            </span>
          )}
        </div>
        <ul className="flex flex-col w-[250px] p-4">
          {profileLinks.map(({ icon, title, url }) => (
            <li key={title}>
              {title === "Logout" ? (
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-2 p-2 rounded-md duration-300 hover:bg-primary hover:text-n0 text-left"
                >
                  <span>{icon}</span>
                  {title}
                </button>
              ) : (
                <Link href={url} className="flex items-center gap-2 p-2 rounded-md duration-300 hover:bg-primary hover:text-n0">
                  <span>{icon}</span>
                  {title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
