import { Search } from "lucide-react";

export default function SearchBar({ keyword, setKeyword }) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8F9C]"
      />
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search by title, skill or company..."
        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#12151D] border border-[#1E2330] text-[#F5F3EE] placeholder:text-[#5b606e] outline-none focus:border-[#FFB020] transition"
      />
    </div>
  );
}