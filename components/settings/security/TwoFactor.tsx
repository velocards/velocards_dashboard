import OptionsVertical from "@/components/shared/OptionsVertical";
import Switch from "@/components/shared/Switch";
const twofactorsettings1 = [
  {
    id: 1,
    title: "Authentication app",
    desc: "Google auth app",
    status: true,
  },
  {
    id: 2,
    title: "Primary email",
    desc: "E-mail used to send notifications",
    status: true,
  },
  {
    id: 3,
    title: "SMS Recovery",
    desc: "Your phone number or something",
    status: false,
  },
];
const twofactorsettings2 = [
  {
    id: 1,
    title: "Mobile Authenticator",
    desc: "Enhance security with a mobile authentication app.",
    status: true,
  },
  {
    id: 2,
    title: "Email Notifications",
    desc: "Receive important notifications via your primary email.",
    status: true,
  },
  {
    id: 3,
    title: "SMS Account Recovery",
    desc: "Enable SMS-based account recovery for added convenience.",
    status: false,
  },
];

const TwoFactor = () => {
  return (
    <div className="box xl:p-8">
      <div className="flex justify-between items-center  bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Two-Factor Authentication</h4>
        <OptionsVertical />
      </div>
      <div className="grid grid-cols-2 md:divide-x rtl:md:divide-x-reverse max-md:gap-4 divide-dashed divide-primary">
        <div className="col-span-2 md:col-span-1 md:ltr:pr-5 md:rtl:pl-5 flex flex-col gap-4 xxl:gap-6">
          {twofactorsettings1.map(({ id, desc, status, title }) => (
            <div key={id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-base md:text-lg xl:text-xl mb-2">
                  {title}
                </p>
                <span className="text-xs md:text-sm">{desc}</span>
              </div>
              <Switch label={title} isChecked={status} />
            </div>
          ))}
        </div>
        <div className="col-span-2 md:col-span-1 md:ltr:pl-5 md:rtl:pr-5 flex flex-col gap-4 xxl:gap-6">
          {twofactorsettings2.map(({ id, desc, status, title }) => (
            <div key={id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-base md:text-lg xl:text-xl mb-2">
                  {title}
                </p>
                <span className="text-xs md:text-sm">{desc}</span>
              </div>
              <Switch label={title} isChecked={status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwoFactor;
