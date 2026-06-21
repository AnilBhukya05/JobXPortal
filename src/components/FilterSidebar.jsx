export default function FilterSidebar({
  days,
  setDays,
  remoteOnly,
  setRemoteOnly,
  jobType,
  setJobType,
}) {
  const types = ["Full Time", "Part Time", "Contract"];

  return (
    <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-6 h-fit md:sticky md:top-28">
      <h2 className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-5">
        FILTERS
      </h2>

      <div className="mb-6">
        <label className="text-sm text-[#F5F3EE] block mb-2">
          Posted within
        </label>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-lg px-3 py-2.5 text-sm text-[#F5F3EE] outline-none focus:border-[#FFB020]"
        >
          <option value={1}>Last 24 Hours</option>
          <option value={3}>Last 3 Days</option>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="text-sm text-[#F5F3EE] block mb-2">Job type</label>
        <div className="flex flex-col gap-2">
          {types.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 text-sm text-[#8A8F9C] cursor-pointer"
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

      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-[#F5F3EE]">Remote only</span>
        <input
          type="checkbox"
          checked={remoteOnly}
          onChange={() => setRemoteOnly((r) => !r)}
          className="accent-[#2DD4BF] w-4 h-4"
        />
      </label>
    </div>
  );
}