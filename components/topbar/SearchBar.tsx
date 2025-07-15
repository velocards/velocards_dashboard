const SearchBar = () => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-primary/5 dark:bg-bg3 hidden border border-n30 dark:border-n500 lg:flex gap-3 rounded-[30px]  focus-within:border-primary px-2 items-center justify-between max-w-[300px] xxxl:max-w-[493px] w-full">
      <input
        type="text"
        placeholder="Search"
        className="bg-transparent py-2 ltr:pl-4 rtl:pr-4 md:py-2.5 xxl:py-3  w-full"
      />
      <button className="bg-primary rounded-full w-9 h-8 flex justify-center items-center text-n0">
        <i className="las la-search text-lg"></i>
      </button>
    </form>
  );
};

export default SearchBar;
