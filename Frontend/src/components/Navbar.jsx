import { BiSearch } from "react-icons/bi";

const Navbar = () => {
  return (
    <div className="bg-[#526D82] py-4">
      <div className="flex items-center justify-center text-white px-4">
        <div className="relative flex items-center">
          <BiSearch className="text-white absolute left-4" size={20} />
          <input
            type="search"
            className="p-3 pl-10 w-[400px] bg-transparent rounded-[10px] border border-gray-300 dark:bg-transparent dark:border 
              border-l-gray-700 dark:border-gray-400 dark:placeholder-gray-100 dark:text-white outline-none"
            placeholder="Search Communities, Posts, Users..."
            required
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
