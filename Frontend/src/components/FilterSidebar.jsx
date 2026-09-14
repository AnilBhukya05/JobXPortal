import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export default function FilterSidebar({
  days, setDays,
  remoteOnly, setRemoteOnly,
  jobType, setJobType,
  experience, setExperience,
  category, setCategory,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const types = ["Full Time", "Part Time", "Contract"];

  const experienceOptions = [
    { label: "Fresher (0-1 yrs)", value: "fresher" },
    { label: "Junior (1-2 yrs)", value: "junior" },
    { label: "Mid-level (2-5 yrs)", value: "mid" },
    { label: "Senior (5+ yrs)", value: "senior" },
  ];

  const categories = [
    { label: "All Jobs", value: "" },
    { label: "IT and Software", value: "software developer" },
    { label: "Data and Analytics", value: "data analyst" },
    { label: "Design and UX", value: "designer" },
    { label: "Marketing", value: "marketing" },
    { label: "Sales", value: "sales" },
    { label: "Finance", value: "finance accountant" },
    { label: "HR", value: "human resources" },
    { label: "Operations", value: "operations manager" },
    { label: "Customer Support", value: "customer support" },
    { label: "Teaching", value: "teacher educator" },
    { label: "Healthcare", value: "doctor nurse healthcare" },
    { label: "Engineering", value: "mechanical civil electrical engineer" },
    { label: "Legal", value: "lawyer legal" },
    { label: "Content", value: "content writer" },
  ];

  const activeCount =
    (days < 30 ? 1 : 0) +
    (remoteOnly ? 1 : 0) +
    jobType.length +
    experience.length +
    (category ? 1 : 0);

  function clearAll() {
    setDays(30);
    setRemoteOnly(false);
    setJobType([]);
    setExperience([]);
    setCategory("");
    setMobileOpen(false);
  }

  const selectStyle = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #D9DFEA",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13,
    color: "#0B132B",
    outline: "none",
    cursor: "pointer",
    fontFamily: "Poppins, sans-serif",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#0B132B",
    display: "block",
    marginBottom: 8,
    fontFamily: "Poppins, sans-serif",
  };

  const checkLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#64748B",
    cursor: "pointer",
    fontFamily: "Poppins, sans-serif",
    transition: "color 0.15s",
    userSelect: "none",
  };

  const filterContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "#64748B",
            textTransform: "uppercase",
          }}
        >
          FILTERS {activeCount > 0 && `(${activeCount})`}
        </span>

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#64748B",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#EF4444")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#64748B")
            }
          >
            CLEAR ALL
          </button>
        )}
      </div>

      <div>
        <label style={labelStyle}>Job Category</label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={selectStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#4F46E5";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(79,70,229,0.10)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#D9DFEA";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Added to feed within</label>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={selectStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#4F46E5";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(79,70,229,0.10)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#D9DFEA";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <option value={1}>Last 24 Hours</option>
          <option value={3}>Last 3 Days</option>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      <div>
        <label style={labelStyle}>Job type</label>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {types.map((type) => (
            <label
              key={type}
              style={checkLabelStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#0B132B")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#64748B")
              }
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
                style={{
                  accentColor: "#4F46E5",
                  width: 15,
                  height: 15,
                  cursor: "pointer",
                }}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Experience</label>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {experienceOptions.map((opt) => (
            <label
              key={opt.value}
              style={checkLabelStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#0B132B")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#64748B")
              }
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
                style={{
                  accentColor: "#14B8A6",
                  width: 15,
                  height: 15,
                  cursor: "pointer",
                }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#0B132B",
            fontFamily: "Poppins",
          }}
        >
          Remote only
        </span>

        <div
          onClick={() => setRemoteOnly((r) => !r)}
          style={{
            width: 40,
            height: 22,
            borderRadius: 11,
            background: remoteOnly ? "#14B8A6" : "#CBD5E1",
            position: "relative",
            cursor: "pointer",
            transition: "background 0.25s",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 3,
              left: remoteOnly ? 21 : 3,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#FFFFFF",
              transition: "left 0.25s",
              boxShadow: "0 1px 3px rgba(15,23,42,0.18)",
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden" style={{ marginBottom: 16 }}>
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 18px",
            background: "#FFFFFF",
            border: "1px solid #D9DFEA",
            borderRadius: 10,
            color: "#0B132B",
            fontFamily: "Poppins",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <SlidersHorizontal size={15} />
          Filters

          {activeCount > 0 && (
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#4F46E5",
                color: "#FFFFFF",
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
          }}
          className="md:hidden"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(11,19,43,0.45)",
              backdropFilter: "blur(3px)",
            }}
            onClick={() => setMobileOpen(false)}
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#FFFFFF",
              borderTop: "1px solid #E2E8F0",
              borderRadius: "20px 20px 0 0",
              padding: 24,
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 -10px 40px rgba(15,23,42,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "#64748B",
                  textTransform: "uppercase",
                }}
              >
                FILTERS
              </span>

              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  color: "#64748B",
                  cursor: "pointer",
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {filterContent}

            <button
              onClick={() => setMobileOpen(false)}
              style={{
                width: "100%",
                marginTop: 20,
                padding: "13px",
                background: "#4F46E5",
                color: "#FFFFFF",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontFamily: "Poppins",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div
        className="hidden md:block"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: 20,
          maxHeight: "calc(100vh - 110px)",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E1 transparent",
          boxShadow: "0 4px 18px rgba(15,23,42,0.04)",
        }}
      >
        {filterContent}
      </div>
    </>
  );
}