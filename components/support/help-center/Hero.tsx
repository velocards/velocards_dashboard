import cn from "@/utils/cn";

const Hero = () => {
  const handleSearch = (e: string) => {
    console.log(e);
  };
  return (
    <div className="box xl:p-6 ">
      <div className="box bg-primary/5 dark:bg-bg3 xl:p-10 xxxl:p-[60px] flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="display-4 mb-6">How Can We Help You?</h2>
          <p className="mb-7 lg:mb-10">Welcome to our Help Center! We&apos;re here to provide you with the assistance and information you need.</p>
          <form className={cn("bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 flex gap-3 rounded-[30px]  focus-within:border-primary p-1 xxl:p-2 items-center justify-between max-w-[200px] xxl:max-w-[319px] w-full", "bg-n0 dark:bg-bg4 xxl:max-w-[610px] max-w-[300px] flex p-1 w-full mx-auto")}>
            <input type="text" placeholder="Search" className="bg-transparent text-sm ltr:pl-4 rtl:pr-4 py-1  w-full" />
            <button className="bg-primary shrink-0 rounded-full w-7 h-7 lg:w-8 lg:h-8 flex justify-center items-center text-n0">
              <i className="las la-search text-lg"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;
