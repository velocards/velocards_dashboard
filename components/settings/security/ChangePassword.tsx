"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { IconEye, IconEyeOff, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

const rules = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter (a-z)" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter (A-Z)" },
  { regex: /[0-9]/, text: "At least 1 number (0-9)" },
  { regex: /[^a-zA-Z0-9]/, text: "At least 1 special character" },
];

const ChangePassword = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch("newPassword");
  const oldPassword = watch("oldPassword");
  const confirmPassword = watch("confirmPassword");
  
  // Check if any field has value
  useEffect(() => {
    setHasChanges(!!(oldPassword || newPassword || confirmPassword));
  }, [oldPassword, newPassword, confirmPassword]);

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true);
    
    try {
      await authApi.changePassword(data.oldPassword, data.newPassword);
      
      toast.success("Password changed successfully! Please log in again with your new password.");
      
      // Clear the form before logout
      reset();
      setHasChanges(false);
      
      // Wait a moment for the user to see the message
      setTimeout(async () => {
        // Logout and redirect to sign-in page
        await logout();
        router.push('/auth/sign-in');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || "Failed to change password";
      
      if (error.response?.status === 401) {
        toast.error("Current password is incorrect");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(); // Clear the form
    setHasChanges(false);
  };

  return (
    <div className="box xl:p-8 xxl:p-10">
      <h4 className="h4 bb-dashed pb-4 mb-4 md:mb-6 md:pb-6">
        Change Password
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 xl:mt-8 grid grid-cols-2 gap-4 xxxl:gap-6">
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="oldPassword" className="md:text-lg font-medium block mb-4">
            Current Password
          </label>
          <div className={`bg-primary/5 dark:bg-bg3 border ${
            errors.oldPassword ? 'border-red-500' : 'border-n30 dark:border-n500'
          } rounded-3xl px-3 md:px-6 py-2 md:py-3 relative`}>
            <input
              type={showOldPass ? "text" : "password"}
              className="w-11/12 text-sm bg-transparent"
              placeholder="Enter current password"
              id="oldPassword"
              {...register("oldPassword")}
              disabled={isLoading}
            />
            <span
              onClick={() => setShowOldPass(!showOldPass)}
              className="absolute ltr:right-5 rtl:left-5 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showOldPass ? <IconEye /> : <IconEyeOff />}
            </span>
          </div>
          {errors.oldPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>
          )}
        </div>
        
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="newPassword" className="md:text-lg font-medium block mb-4">
            New Password
          </label>
          <div className={`bg-primary/5 dark:bg-bg3 border ${
            errors.newPassword ? 'border-red-500' : 'border-n30 dark:border-n500'
          } rounded-3xl px-3 md:px-6 py-2 md:py-3 relative`}>
            <input
              type={showNewPass ? "text" : "password"}
              className="w-11/12 text-sm bg-transparent"
              placeholder="Enter new password"
              id="newPassword"
              {...register("newPassword")}
              disabled={isLoading}
            />
            <span
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute ltr:right-5 rtl:left-5 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showNewPass ? <IconEye /> : <IconEyeOff />}
            </span>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>
        
        <div className="col-span-2">
          <label htmlFor="confirmPassword" className="md:text-lg font-medium block mb-4">
            Confirm Password
          </label>
          <div className={`bg-primary/5 dark:bg-bg3 border ${
            errors.confirmPassword ? 'border-red-500' : 'border-n30 dark:border-n500'
          } rounded-3xl px-3 md:px-6 py-2 md:py-3 relative`}>
            <input
              type={showConfirmPass ? "text" : "password"}
              className="w-11/12 text-sm bg-transparent"
              placeholder="Confirm new password"
              id="confirmPassword"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            <span
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute ltr:right-5 rtl:left-5 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showConfirmPass ? <IconEye /> : <IconEyeOff />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <div className="col-span-2">
          <p className="font-medium text-lg mb-4">
            New password must contain:
          </p>
          <ul className="flex flex-col gap-3 list-inside">
            {rules.map((rule) => {
              const isValid = newPassword ? rule.regex.test(newPassword) : false;
              return (
                <li key={rule.text} className="flex items-center gap-2">
                  {isValid ? (
                    <IconCircleCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <IconCircleX className="h-5 w-5 text-n400" />
                  )}
                  <span className={isValid ? 'text-green-600 dark:text-green-400' : 'text-n600 dark:text-n400'}>
                    {rule.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="col-span-2 flex gap-4">
          <button 
            type="submit" 
            className="btn-primary px-5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          {hasChanges && (
            <button 
              type="button"
              onClick={handleCancel}
              className="btn-outline px-5"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;