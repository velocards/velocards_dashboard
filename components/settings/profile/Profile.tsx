"use client";
import CheckboxCustom from "@/components/shared/Checkbox";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { toast } from "react-toastify";
import { IconLock, IconInfoCircle } from "@tabler/icons-react";
import ChangePassword from "@/components/settings/security/ChangePassword";
import LinkedProviders from "@/components/settings/profile/LinkedProviders";
import { getNames } from 'country-list';

const Profile = () => {
  const { user } = useAuthStore();
  const { updateProfile, fetchProfile } = useUserStore();
  
  // Get country list and add "Select Country" as first option
  const countries = useMemo(() => {
    const countryNames = getNames();
    return ["Select Country", ...countryNames.sort()];
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasAddressChanges, setHasAddressChanges] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
  });
  
  // Address form data state
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    country: "Select Country",
    postalCode: ""
  });
  
  // Original form data to track changes
  const [originalFormData, setOriginalFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
  });
  
  // Original address data to track changes
  const [originalAddressData, setOriginalAddressData] = useState({
    street: "",
    city: "",
    state: "",
    country: "Select Country",
    postalCode: ""
  });

  // Check if user is KYC verified
  const isKycVerified = user?.kycStatus === 'approved';

  useEffect(() => {
    // Update form data when user data is loaded
    if (user) {
      const userData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: "male", // Default since it's not in the user object
      };
      setFormData(userData);
      setOriginalFormData(userData);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    
    // Check if form has changes
    const hasAnyChange = Object.keys(newFormData).some(
      key => newFormData[key as keyof typeof newFormData] !== originalFormData[key as keyof typeof originalFormData]
    );
    setHasChanges(hasAnyChange);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isKycVerified) {
      toast("Personal details cannot be changed after KYC verification");
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the API to update profile
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });
      
      // Refresh the profile data
      await fetchProfile();
      
      toast.success("Profile updated successfully!");
      setOriginalFormData(formData); // Update original data after save
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    setFormData(originalFormData);
    setHasChanges(false);
  };

  // Handle address input changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    const newAddressData = {
      ...addressData,
      [name]: value
    };
    setAddressData(newAddressData);
    
    // Check if address has changes
    const hasAnyChange = Object.keys(newAddressData).some(
      key => newAddressData[key as keyof typeof newAddressData] !== originalAddressData[key as keyof typeof originalAddressData]
    );
    setHasAddressChanges(hasAnyChange);
  };

  // Handle address form submission
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isKycVerified) {
      toast("Address details cannot be changed after KYC verification");
      return;
    }

    // Don't submit if country is not selected
    if (addressData.country === "Select Country") {
      toast.error("Please select a country");
      return;
    }

    setIsAddressLoading(true);
    
    try {
      // Call the API to update address
      await updateProfile({
        address: {
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          postalCode: addressData.postalCode
        }
      });
      
      // Refresh the profile data
      await fetchProfile();
      
      toast.success("Address updated successfully!");
      setOriginalAddressData(addressData); // Update original data after save
      setHasAddressChanges(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update address");
    } finally {
      setIsAddressLoading(false);
    }
  };

  // Handle address cancel
  const handleAddressCancel = () => {
    // Reset address to original data
    setAddressData(originalAddressData);
    setHasAddressChanges(false);
  };

  return (
    <div className="grid grid-cols-12 gap-4 xxxxxl:gap-6">
      <div className="col-span-12 lg:col-span-6">
        {/* Account Settings */}
        <div className="box xxl:p-8 xxxl:p-10 mb-4 xxxxxl:mb-6">
          <h4 className="h4 bb-dashed mb-4 pb-4 md:mb-6 md:pb-6">Account Settings</h4>
          
          {/* KYC Verification Notice */}
          {isKycVerified && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
              <IconLock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Personal Details Locked
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Your personal information cannot be edited after KYC verification. 
                  If you need to make changes, please contact support.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSaveChanges} className="grid grid-cols-2 gap-4 xxxxxl:gap-6">
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="firstName" className="md:text-lg font-medium block mb-4">
                First Name
                {isKycVerified && <IconLock className="inline-block ml-2 h-4 w-4 text-n500" />}
              </label>
              <input 
                type="text" 
                className={`w-full text-sm border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 ${
                  isKycVerified 
                    ? 'bg-n20 dark:bg-n800 cursor-not-allowed opacity-75' 
                    : 'bg-primary/5 dark:bg-bg3'
                }`}
                id="firstName" 
                name="firstName"
                placeholder="First Name" 
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isKycVerified}
                required 
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="lastName" className="md:text-lg font-medium block mb-4">
                Last Name
                {isKycVerified && <IconLock className="inline-block ml-2 h-4 w-4 text-n500" />}
              </label>
              <input 
                type="text" 
                className={`w-full text-sm border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 ${
                  isKycVerified 
                    ? 'bg-n20 dark:bg-n800 cursor-not-allowed opacity-75' 
                    : 'bg-primary/5 dark:bg-bg3'
                }`}
                placeholder="Enter Last Name" 
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isKycVerified}
                required 
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="email" className="md:text-lg font-medium block mb-4">
                Email
                {isKycVerified && <IconLock className="inline-block ml-2 h-4 w-4 text-n500" />}
              </label>
              <input 
                type="email" 
                className={`w-full text-sm border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 ${
                  isKycVerified 
                    ? 'bg-n20 dark:bg-n800 cursor-not-allowed opacity-75' 
                    : 'bg-primary/5 dark:bg-bg3'
                }`}
                placeholder="Enter Email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isKycVerified}
                required 
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="phone" className="md:text-lg font-medium block mb-4">
                Phone (Optional)
                {isKycVerified && <IconLock className="inline-block ml-2 h-4 w-4 text-n500" />}
              </label>
              <input 
                type="text" 
                className={`w-full text-sm border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 ${
                  isKycVerified 
                    ? 'bg-n20 dark:bg-n800 cursor-not-allowed opacity-75' 
                    : 'bg-primary/5 dark:bg-bg3'
                }`}
                placeholder="Enter Phone" 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isKycVerified}
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="gender" className="md:text-lg font-medium block mb-4">
                Gender :
              </label>
              <div className="flex gap-5">
                <label htmlFor="male" className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    id="male" 
                    name="gender" 
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleInputChange}
                    disabled={isKycVerified}
                    className="accent-secondary scale-125" 
                  /> Male
                </label>
                <label htmlFor="female" className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    id="female" 
                    name="gender" 
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleInputChange}
                    disabled={isKycVerified}
                    className="accent-secondary scale-125" 
                  /> Female
                </label>
                <label htmlFor="other" className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    id="other" 
                    name="gender" 
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleInputChange}
                    disabled={isKycVerified}
                    className="accent-secondary scale-125" 
                  /> Other
                </label>
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex flex-col gap-4">
                <CheckboxCustom label="I agree to the privacy & policy" />
                <CheckboxCustom label="I agree with all terms & conditions" />
              </div>
              <div className="flex mt-6 xxl:mt-10 gap-4">
                <button 
                  type="submit"
                  className="btn-primary px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || isKycVerified || !hasChanges}
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
            </div>
          </form>
        </div>
        
        {/* Address */}
        <div className="box xxl:p-8 xxxl:p-10">
          <h4 className="h4 bb-dashed mb-4 pb-4 md:mb-6 md:pb-6">Address</h4>
          
          {isKycVerified && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2">
              <IconInfoCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Address details are locked after KYC verification.
              </p>
            </div>
          )}

          <form onSubmit={handleAddressSubmit} className="mt-6 xl:mt-8 grid grid-cols-2 gap-4 xxxl:gap-6">
            <div className="col-span-2">
              <label htmlFor="street" className="md:text-lg font-medium block mb-4">
                Street Address
              </label>
              <input 
                type="text" 
                className={`w-full text-sm border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 ${
                  isKycVerified 
                    ? 'bg-n20 dark:bg-n800 cursor-not-allowed opacity-75' 
                    : 'bg-primary/5 dark:bg-bg3'
                }`}
                placeholder="Enter street address" 
                value={addressData.street}
                onChange={handleAddressChange}
                name="street"
                id="street" 
                disabled={isKycVerified}
                required 
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="city" className="md:text-lg font-medium block mb-4">
                City
              </label>
              <input 
                type="text" 
                className={`w-full text-sm border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 ${
                  isKycVerified 
                    ? 'bg-n20 dark:bg-n800 cursor-not-allowed opacity-75' 
                    : 'bg-primary/5 dark:bg-bg3'
                }`}
                placeholder="Enter city" 
                value={addressData.city}
                onChange={handleAddressChange}
                name="city"
                id="city" 
                disabled={isKycVerified}
                required 
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="state" className="md:text-lg font-medium block mb-4">
                State/Province
              </label>
              <input 
                type="text" 
                className={`w-full text-sm border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 ${
                  isKycVerified 
                    ? 'bg-n20 dark:bg-n800 cursor-not-allowed opacity-75' 
                    : 'bg-primary/5 dark:bg-bg3'
                }`}
                placeholder="Enter state or province" 
                value={addressData.state}
                onChange={handleAddressChange}
                name="state"
                id="state" 
                disabled={isKycVerified}
                required 
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="country" className="md:text-lg font-medium block mb-4">
                Country
              </label>
              <SearchableSelect 
                items={countries} 
                setSelected={(value) => {
                  handleAddressChange({ target: { name: 'country', value } });
                }} 
                selected={addressData.country} 
                btnClass={`md:py-3 w-full py-2.5 rounded-[32px] md:px-5 ${
                  isKycVerified ? 'opacity-75 cursor-not-allowed' : ''
                }`} 
                contentClass="w-full"
                placeholder="Search countries..."
                disabled={isKycVerified}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="postalCode" className="md:text-lg font-medium block mb-4">
                Postal/Zip Code
              </label>
              <input 
                type="text" 
                className={`w-full text-sm border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 ${
                  isKycVerified 
                    ? 'bg-n20 dark:bg-n800 cursor-not-allowed opacity-75' 
                    : 'bg-primary/5 dark:bg-bg3'
                }`}
                placeholder="Enter postal code" 
                value={addressData.postalCode}
                onChange={handleAddressChange}
                name="postalCode"
                id="postalCode" 
                disabled={isKycVerified}
                required 
              />
            </div>
            <div className="col-span-2 flex pt-4 gap-4">
              <button 
                type="submit"
                className="btn-primary px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAddressLoading || isKycVerified || !hasAddressChanges}
              >
                {isAddressLoading ? "Saving..." : "Save Address"}
              </button>
              {hasAddressChanges && (
                <button 
                  type="button"
                  onClick={handleAddressCancel}
                  className="btn-outline px-5"
                  disabled={isAddressLoading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-6">
        {/* Change Password Section */}
        <ChangePassword />
        
        {/* Linked Providers Section */}
        <div className="mt-4 xxxxxl:mt-6">
          <LinkedProviders />
        </div>
      </div>
    </div>
  );
};

export default Profile;