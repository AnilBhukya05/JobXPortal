import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const emptyForm = {
  title: "",
  employmentType: "Full-time",
  location: "Remote",
  experience: "",
  salary: "",
  shortDescription: "",
  description: "",
  responsibilities: [""],
  requirements: [""],

  // Changed to simple text
  benefits: "",

  // Changed to simple text
  skills: "",

  status: "active",
};

function AdminCareerForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(id);

  // =========================================================
  // LOAD CAREER FOR EDIT
  // =========================================================

  useEffect(() => {
    if (isEdit) {
      fetchCareer();
    }
  }, [id]);

  // =========================================================
  // GET TOKEN
  // =========================================================

  const getToken = () => {
    return (
      localStorage.getItem("jobxportal_token") ||
      sessionStorage.getItem("jobxportal_token")
    );
  };

  // =========================================================
  // FETCH CAREER
  // =========================================================

  const fetchCareer = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/careers/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load career"
        );
      }

      const career =
        data.career || data.data;

      setForm({
        title: career.title || "",

        employmentType:
          career.employmentType ||
          "Full-time",

        location:
          career.location ||
          "Remote",

        experience:
          career.experience || "",

        salary:
          career.salary || "",

        shortDescription:
          career.shortDescription || "",

        description:
          career.description || "",

        responsibilities:
          career.responsibilities?.length > 0
            ? career.responsibilities
            : [""],

        requirements:
          career.requirements?.length > 0
            ? career.requirements
            : [""],

        // =====================================================
        // BENEFITS
        // =====================================================
        // If old database has an array, convert it to lines.
        benefits: Array.isArray(
          career.benefits
        )
          ? career.benefits.join("\n")
          : career.benefits || "",

        // =====================================================
        // SKILLS
        // =====================================================
        // If old database has an array, convert it to lines.
        skills: Array.isArray(
          career.skills
        )
          ? career.skills.join(", ")
          : career.skills || "",

        status:
          career.status || "active",
      });
    } catch (err) {
      console.error(
        "FETCH CAREER ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to load career"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // BASIC INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ARRAY INPUT CHANGE
  // =========================================================

  const handleArrayChange = (
    field,
    index,
    value
  ) => {
    setForm((prev) => ({
      ...prev,

      [field]: prev[field].map(
        (item, i) =>
          i === index
            ? value
            : item
      ),
    }));
  };

  // =========================================================
  // ADD ARRAY ITEM
  // =========================================================

  const addItem = (field) => {
    setForm((prev) => ({
      ...prev,

      [field]: [
        ...prev[field],
        "",
      ],
    }));
  };

  // =========================================================
  // REMOVE ARRAY ITEM
  // =========================================================

  const removeItem = (
    field,
    index
  ) => {
    setForm((prev) => {
      const updated =
        prev[field].filter(
          (_, i) =>
            i !== index
        );

      return {
        ...prev,

        [field]:
          updated.length
            ? updated
            : [""],
      };
    });
  };

  // =========================================================
  // CREATE SLUG
  // =========================================================

  const createSlug = (
    title
  ) => {
    return title
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /(^-|-$)/g,
        ""
      );
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token =
        getToken();

      if (!token) {
        throw new Error(
          "Admin session expired. Please login again."
        );
      }

      // =====================================================
      // BENEFITS
      // =====================================================
      // Convert textarea lines into an array
      // before sending to backend.

      const benefitsArray =
        form.benefits
          .split("\n")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);

      // =====================================================
      // SKILLS
      // =====================================================
      // Supports:
      //
      // React.js, JavaScript, HTML, CSS
      //
      // OR:
      //
      // React.js
      // JavaScript
      // HTML
      // CSS

      const skillsArray =
        form.skills
          .split(/[\n,]+/)
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);

      // =====================================================
      // PAYLOAD
      // =====================================================

      const payload = {
        ...form,

        slug: createSlug(
          form.title
        ),

        responsibilities:
          form.responsibilities
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),

        requirements:
          form.requirements
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),

        // Send as arrays to backend
        benefits:
          benefitsArray,

        skills:
          skillsArray,
      };

      // =====================================================
      // API URL
      // =====================================================

      const url = isEdit
        ? `${API_URL}/careers/admin/${id}`
        : `${API_URL}/careers/admin`;

      const method =
        isEdit
          ? "PUT"
          : "POST";

      // =====================================================
      // REQUEST
      // =====================================================

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(
              payload
            ),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save career"
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      navigate(
        "/admin/careers"
      );
    } catch (err) {
      console.error(
        "SAVE CAREER ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to save career"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FF]">
        <p className="text-slate-500">
          Loading career...
        </p>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F7F9FF] px-6 py-8">

      <div className="max-w-[1500px] mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <button
            onClick={() =>
              navigate(
                "/admin/careers"
              )
            }
            className="flex items-center gap-2 text-[#526B91] hover:text-[#4F46E5] mb-5"
          >
            <ArrowLeft
              size={20}
            />

            Back to Careers
          </button>

          <h1 className="text-4xl font-bold text-[#08132F]">
            {isEdit
              ? "Edit Career"
              : "Create Career"}
          </h1>

          <p className="text-lg text-[#526B91] mt-2">
            {isEdit
              ? "Update this JobXPortal hiring position."
              : "Create a new JobXPortal hiring position."}
          </p>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
            {error}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="bg-white border border-[#DDE4F0] rounded-3xl p-10 shadow-sm">

            <h2 className="text-2xl font-bold text-[#08132F] mb-8">
              Basic Information
            </h2>

            <div className="space-y-6">

              {/* TITLE */}

              <div>

                <label className="block font-semibold text-[#08132F] mb-3">
                  Job Title *
                </label>

                <input
                  name="title"
                  value={
                    form.title
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Frontend Developer"
                  className="w-full h-16 px-5 rounded-2xl border border-[#D8E0ED] outline-none focus:border-[#4F46E5] text-lg"
                />

              </div>

              {/* EMPLOYMENT + LOCATION */}

              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <label className="block font-semibold text-[#08132F] mb-3">
                    Employment Type *
                  </label>

                  <select
                    name="employmentType"
                    value={
                      form.employmentType
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full h-16 px-5 rounded-2xl border border-[#D8E0ED] outline-none focus:border-[#4F46E5]"
                  >

                    <option value="Full-time">
                      Full-time
                    </option>

                    <option value="Part-time">
                      Part-time
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Contract">
                      Contract
                    </option>

                    <option value="Volunteer">
                      Volunteer
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block font-semibold text-[#08132F] mb-3">
                    Location *
                  </label>

                  <input
                    name="location"
                    value={
                      form.location
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Remote"
                    className="w-full h-16 px-5 rounded-2xl border border-[#D8E0ED] outline-none focus:border-[#4F46E5]"
                  />

                </div>

                <div>

                  <label className="block font-semibold text-[#08132F] mb-3">
                    Experience *
                  </label>

                  <input
                    name="experience"
                    value={
                      form.experience
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="0–2 years"
                    className="w-full h-16 px-5 rounded-2xl border border-[#D8E0ED] outline-none focus:border-[#4F46E5]"
                  />

                </div>

                <div>

                  <label className="block font-semibold text-[#08132F] mb-3">
                    Salary
                  </label>

                  <input
                    name="salary"
                    value={
                      form.salary
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="₹5,00,000 – ₹8,00,000 per year"
                    className="w-full h-16 px-5 rounded-2xl border border-[#D8E0ED] outline-none focus:border-[#4F46E5]"
                  />

                </div>

              </div>

              {/* SHORT DESCRIPTION */}

              <div>

                <label className="block font-semibold text-[#08132F] mb-3">
                  Short Description *
                </label>

                <textarea
                  name="shortDescription"
                  value={
                    form.shortDescription
                  }
                  onChange={
                    handleChange
                  }
                  required
                  rows={4}
                  placeholder="Short description displayed on the careers listing."
                  className="w-full p-5 rounded-2xl border border-[#D8E0ED] outline-none focus:border-[#4F46E5] resize-none"
                />

              </div>

            </div>

          </section>

          {/* =================================================
              JOB DESCRIPTION
          ================================================= */}

          <section className="bg-white border border-[#DDE4F0] rounded-3xl p-10 shadow-sm">

            <h2 className="text-2xl font-bold text-[#08132F] mb-6">
              Job Description
            </h2>

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              required
              rows={10}
              placeholder="Describe the role, team and what the candidate will work on..."
              className="w-full p-5 rounded-2xl border border-[#D8E0ED] outline-none focus:border-[#4F46E5] resize-y text-lg"
            />

          </section>

          {/* =================================================
              RESPONSIBILITIES
          ================================================= */}

          <ArraySection
            title="Responsibilities"
            subtitle="What will the candidate do?"
            field="responsibilities"
            items={
              form.responsibilities
            }
            onChange={
              handleArrayChange
            }
            onAdd={
              addItem
            }
            onRemove={
              removeItem
            }
            placeholder="Responsibility"
          />

          {/* =================================================
              REQUIREMENTS
          ================================================= */}

          <ArraySection
            title="Requirements"
            subtitle="Skills and qualifications required."
            field="requirements"
            items={
              form.requirements
            }
            onChange={
              handleArrayChange
            }
            onAdd={
              addItem
            }
            onRemove={
              removeItem
            }
            placeholder="Requirement"
          />

          {/* =================================================
              BENEFITS
              SINGLE TEXTAREA
          ================================================= */}

          <TextAreaSection
            title="Benefits"
            subtitle="What will the candidate gain from this opportunity?"
            name="benefits"
            value={
              form.benefits
            }
            onChange={
              handleChange
            }
            placeholder={
              "Example:\nHands-on experience with real-world projects\nMentorship from experienced developers\nFlexible remote work environment\nCertificate upon successful completion"
            }
          />

          {/* =================================================
              SKILLS
              SINGLE TEXTAREA
          ================================================= */}

          <TextAreaSection
            title="Skills"
            subtitle="Skills relevant to this position."
            name="skills"
            value={
              form.skills
            }
            onChange={
              handleChange
            }
            placeholder={
              "Example:\nReact.js, JavaScript, HTML, CSS, Tailwind CSS, Git, GitHub, REST APIs"
            }
          />

          {/* =================================================
              PUBLISHING
          ================================================= */}

          <section className="bg-white border border-[#DDE4F0] rounded-3xl p-10 shadow-sm">

            <h2 className="text-2xl font-bold text-[#08132F] mb-6">
              Publishing
            </h2>

            <label className="block font-semibold text-[#08132F] mb-3">
              Status
            </label>

            <select
              name="status"
              value={
                form.status
              }
              onChange={
                handleChange
              }
              className="w-full md:w-[480px] h-16 px-5 rounded-2xl border border-[#D8E0ED] outline-none focus:border-[#4F46E5]"
            >

              <option value="active">
                Active — visible publicly
              </option>

              <option value="draft">
                Draft — not visible publicly
              </option>

              <option value="closed">
                Closed — no longer accepting applications
              </option>

            </select>

          </section>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex justify-end gap-4 pb-10">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/careers"
                )
              }
              className="px-8 h-16 rounded-2xl border border-[#D8E0ED] bg-white text-[#526B91] font-semibold hover:bg-[#F8FAFF]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 h-16 rounded-2xl bg-[#4F46E5] text-white font-semibold flex items-center gap-3 hover:bg-[#4338CA] disabled:opacity-60"
            >

              <Save
                size={20}
              />

              {saving
                ? "Saving..."
                : isEdit
                ? "Update Career"
                : "Create Career"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

// =========================================================
// ARRAY SECTION
// Used ONLY for Responsibilities + Requirements
// =========================================================

function ArraySection({
  title,
  subtitle,
  field,
  items,
  onChange,
  onAdd,
  onRemove,
  placeholder,
}) {
  return (
    <section className="bg-white border border-[#DDE4F0] rounded-3xl p-10 shadow-sm">

      <div className="flex items-start justify-between mb-7">

        <div>

          <h2 className="text-2xl font-bold text-[#08132F]">
            {title}
          </h2>

          <p className="text-lg text-[#526B91] mt-1">
            {subtitle}
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            onAdd(field)
          }
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#EEF0FF] text-[#4F46E5] font-semibold hover:bg-[#E4E7FF]"
        >

          <Plus
            size={20}
          />

          Add

        </button>

      </div>

      <div className="space-y-4">

        {items.map(
          (
            item,
            index
          ) => (
            <div
              key={index}
              className="flex items-center gap-4"
            >

              <input
                value={item}
                onChange={(e) =>
                  onChange(
                    field,
                    index,
                    e.target.value
                  )
                }
                placeholder={`${placeholder} ${index + 1}`}
                className="flex-1 h-16 px-5 rounded-2xl border border-[#D8E0ED] outline-none focus:border-[#4F46E5] text-lg"
              />

              <button
                type="button"
                onClick={() =>
                  onRemove(
                    field,
                    index
                  )
                }
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
              >

                <Trash2
                  size={21}
                />

              </button>

            </div>
          )
        )}

      </div>

    </section>
  );
}

// =========================================================
// TEXTAREA SECTION
// Used ONLY for Benefits + Skills
// =========================================================

function TextAreaSection({
  title,
  subtitle,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <section className="bg-white border border-[#DDE4F0] rounded-3xl p-10 shadow-sm">

      <div className="mb-7">

        <h2 className="text-2xl font-bold text-[#08132F]">
          {title}
        </h2>

        <p className="text-lg text-[#526B91] mt-1">
          {subtitle}
        </p>

      </div>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={8}
        placeholder={placeholder}
        className="w-full p-5 rounded-2xl border border-[#D8E0ED] outline-none focus:border-[#4F46E5] resize-y text-lg"
      />

      <p className="text-sm text-[#8A96AA] mt-3">
        You can paste the complete content here. Use a new line for each item.
      </p>

    </section>
  );
}

export default AdminCareerForm;