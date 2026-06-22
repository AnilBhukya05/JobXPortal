export default function FilterSidebar({
  days,
  setDays,
  remoteOnly,
  setRemoteOnly,
  jobType,
  setJobType,
  experience,
  setExperience,
}) {
  const types = ["Full Time", "Part Time", "Contract"];

  const experienceOptions = [
    { label: "Fresher (0-1 years)", value: "fresher" },
    { label: "Junior (1-2 years)", value: "junior" },
    { label: "Mid-level (2-5 years)", value: "mid" },
    { label: "Senior (5+ years)", value: "senior" },
  ];

  return (
    <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-6 h-fit md:sticky md:top-28">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-mono text-xs tracking-widest text-[#8A8F9C]">
          FILTERS
        </h2>
        <button
          onClick={() => {
            setDays(30);
            setRemoteOnly(false);
            setJobType([]);
            setExperience([]);
          }}
          className="font-mono text-[10px] text-[#8A8F9C] hover:text-[#fb7185] transition tracking-wider"
        >
          CLEAR ALL
        </button>
      </div>

      {/* POSTED WITHIN */}
      <div className="mb-6">
        <label className="text-sm text-[#F5F3EE] block mb-2">
          Added to feed within
        </label>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-lg px-3 py-2.5 text-sm text-[#F5F3EE] outline-none focus:border-[#FFB020] transition-colors"
        >
          <option value={1}>Last 24 Hours</option>
          <option value={3}>Last 3 Days</option>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      {/* JOB TYPE */}
      <div className="mb-6">
        <label className="text-sm text-[#F5F3EE] block mb-3">Job type</label>
        <div className="flex flex-col gap-2.5">
          {types.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 text-sm text-[#8A8F9C] cursor-pointer hover:text-[#F5F3EE] transition"
            >
              <input
                type="checkbox"
                checked={jobType.includes(type)}
                onChange={() =>
                  setJobType((prev) =>
                    prev.includes(type)
                      ? prev.filter((t) => t !== type)
                      : [...prev, type]
                  )
                }
                className="accent-[#FFB020]"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* EXPERIENCE */}
      <div className="mb-6">
        <label className="text-sm text-[#F5F3EE] block mb-3">Experience</label>
        <div className="flex flex-col gap-2.5">
          {experienceOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-[#8A8F9C] cursor-pointer hover:text-[#F5F3EE] transition"
            >
              <input
                type="checkbox"
                checked={experience.includes(opt.value)}
                onChange={() =>
                  setExperience((prev) =>
                    prev.includes(opt.value)
                      ? prev.filter((e) => e !== opt.value)
                      : [...prev, opt.value]
                  )
                }
                className="accent-[#2DD4BF]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* REMOTE ONLY */}
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-[#F5F3EE]">Remote only</span>
        <div
          onClick={() => setRemoteOnly((r) => !r)}
          className={`relative w-10 h-5 rounded-full transition-colors duration-300 cursor-pointer ${
            remoteOnly ? "bg-[#2DD4BF]" : "bg-[#1E2330]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
              remoteOnly ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </label>
    </div>
  );
}