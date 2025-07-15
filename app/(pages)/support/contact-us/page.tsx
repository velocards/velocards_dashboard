import GetInTouch from "@/components/support/contact/GetInTouch";
import Map from "@/components/support/contact/Map";
import MoreHelp from "@/components/support/contact/MoreHelp";

const ContactPage = () => {
  return (
    <div>
      <div className="grid grid-cols-12 gap-4 xxl:gap-6">
        <div className="col-span-12 lg:col-span-7 xxl:col-span-8">
          <GetInTouch />
        </div>
        <div className="col-span-12 lg:col-span-5 xxl:col-span-4">
          <MoreHelp />
        </div>
        <div className="col-span-12">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
