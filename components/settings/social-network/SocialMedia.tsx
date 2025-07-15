import OptionsVertical from "@/components/shared/OptionsVertical";
const extensionsList = [
  {
    id: 1,
    title: "Facebook",
    link: "www.example.com",
    icon: <i className="lab la-facebook-f text-3xl"></i>,
    connected: true,
  },
  {
    id: 2,
    title: "Twitter",
    link: "www.example.com",
    icon: <i className="lab la-twitter text-3xl"></i>,
    connected: false,
  },
  {
    id: 3,
    title: "LinkedIn",
    link: "www.example.com",
    icon: <i className="lab la-linkedin-in text-3xl"></i>,
    connected: false,
  },
  {
    id: 4,
    title: "Snapchat",
    link: "www.example.com",
    icon: <i className="lab la-snapchat text-3xl"></i>,
    connected: false,
  },
  {
    id: 5,
    title: "Pinterest",
    link: "www.example.com",
    icon: <i className="lab la-pinterest text-3xl"></i>,
    connected: false,
  },
];
const SocialMedia = () => {
  return (
    <div className="box xl:p-8">
      <div className="flex justify-between items-center  bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Social Media</h4>
        <OptionsVertical />
      </div>
      <div className="flex flex-col gap-4 xxl:gap-6">
        {extensionsList.map(({ id, title, icon, link, connected }) => (
          <div
            key={id}
            className="p-4 sm:p-5 md:p-6 bg-primary/5 dark:bg-bg3 flex-wrap gap-4 rounded-xl border border-n30 dark:border-n500 flex justify-between items-center">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="bg-n0 dark:bg-bg4 rounded-full text-primary py-2 px-3 text-3xl">
                {icon}
              </div>
              <div>
                <p className="text-xs mb-2">{title}</p>
                <p className="text-lg lg:text-xl font-medium">{link}</p>
              </div>
            </div>
            <button className="btn-outline">
              {connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
      <button className="btn-outline mt-6">
        {" "}
        <i className="las la-plus-circle"></i> Add More
      </button>
    </div>
  );
};

export default SocialMedia;
