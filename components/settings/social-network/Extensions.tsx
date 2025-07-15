import OptionsVertical from "@/components/shared/OptionsVertical";
const extensionsList = [
  {
    id: 1,
    title: "Dropbox",
    link: "@example.info",
    icon: <i className="lab la-dropbox text-3xl"></i>,
  },
  {
    id: 2,
    title: "Google Drive",
    link: "@example.info",
    icon: <i className="lab la-google-drive text-3xl"></i>,
  },
  {
    id: 3,
    title: "Microsoft Onedrive",
    link: "@example.info",
    icon: <i className="lab la-microsoft text-3xl"></i>,
  },
];
const Extensions = () => {
  return (
    <div className="box xl:p-8">
      <div className="flex justify-between items-center  bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Extensions</h4>
        <OptionsVertical />
      </div>
      <div className="flex flex-col gap-4 xxl:gap-6">
        {extensionsList.map(({ id, title, icon, link }) => (
          <div
            key={id}
            className="p-4 sm:p-5 md:p-6 bg-primary/5 dark:bg-bg3 rounded-xl border border-n30 gap-4 dark:border-n500 flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="bg-n0 dark:bg-bg4 rounded-full text-primary py-2 px-3 text-3xl">
                {icon}
              </div>
              <div>
                <p className="text-xs mb-2">{title}</p>
                <p className="text-lg lg:text-xl font-medium">{link}</p>
              </div>
            </div>
            <button className="btn-outline">Remove</button>
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

export default Extensions;
