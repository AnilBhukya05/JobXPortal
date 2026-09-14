import { Search } from "lucide-react";

export default function SearchBar({ keyword, setKeyword }) {
  return (
    <div className="relative w-full">
      <Search
        size={19}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]"
      />

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search by title, skill or company..."
        className="
          w-full
          pl-11
          pr-4
          py-3
          rounded-xl
          bg-white
          border
          border-[#D9DFEA]
          text-[#0B132B]
          placeholder:text-[#64748B]
          outline-none
          focus:border-[#4F46E5]
          focus:ring-2
          focus:ring-[#4F46E5]/10
          transition
        "
      />
    </div>
  );
}