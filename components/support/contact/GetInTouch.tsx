"use client";
import Select from "@/components/shared/Select";
import { useState } from "react";
const countries = ["USA", "UK", "Canada", "Germany", "Egypt"];
const GetInTouch = () => {
  const [country, setCountry] = useState(countries[0]);
  return (
    <div className="box xl:p-8">
      <h4 className="h4 bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">Get in touch with us.</h4>
      <form className="grid grid-cols-2 gap-4 xl:gap-6">
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="name" className="md:text-lg font-medium block mb-4">
            Name
          </label>
          <input type="text" className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3" placeholder="Enter Your Name" id="name" required />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="email" className="md:text-lg font-medium block mb-4">
            Email
          </label>
          <input type="email" className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3" placeholder="Enter Your Email" id="email" required />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="phone" className="md:text-lg font-medium block mb-4">
            Phone
          </label>
          <input type="number" className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3" placeholder="Enter Your Number" id="phone" required />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="country" className="md:text-lg font-medium block mb-4">
            Country
          </label>
          <Select items={countries} setSelected={setCountry} selected={country} btnClass="rounded-[32px] bg-secondary/5 py-2.5 md:py-3 md:px-5" contentClass="w-full" />
        </div>
        <div className="col-span-2">
          <label htmlFor="message" className="md:text-lg font-medium block mb-4">
            Message
          </label>
          <textarea rows={5} className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3" placeholder="Enter Your Message..." id="message" required></textarea>
        </div>
        <div className="col-span-2">
          <button className="btn-primary px-6">Send Message</button>
        </div>
      </form>
    </div>
  );
};

export default GetInTouch;
