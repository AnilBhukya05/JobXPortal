import Career from "../models/Career.js";
import CareerApplication from "../models/CareerApplication.js";

// =========================================================
// CREATE SLUG
// =========================================================

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// =========================================================
// PUBLIC CAREERS
// =========================================================

// Get active careers
export async function getPublicCareers(req, res) {
  try {
    const careers = await Career.find({
      status: "active",
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      careers,
    });
  } catch (error) {
    console.error("GET PUBLIC CAREERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch careers",
    });
  }
}

// Get single active career
export async function getPublicCareer(req, res) {
  try {
    const career = await Career.findOne({
      slug: req.params.slug,
      status: "active",
    });

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    res.json({
      success: true,
      career,
    });
  } catch (error) {
    console.error("GET PUBLIC CAREER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch career",
    });
  }
}

// =========================================================
// ADMIN CAREERS
// =========================================================

// Get all careers
export async function getAdminCareers(req, res) {
  try {
    const careers = await Career.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      careers,
    });
  } catch (error) {
    console.error("GET ADMIN CAREERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch careers",
    });
  }
}

// Get career for admin
export async function getAdminCareer(req, res) {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    res.json({
      success: true,
      career,
    });
  } catch (error) {
    console.error("GET ADMIN CAREER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch career",
    });
  }
}

// =========================================================
// CREATE CAREER
// =========================================================

export async function createCareer(req, res) {
  try {
    const {
      title,
      type,
      employmentType,
      location,
      experience,
      salary,
      shortDescription,
      description,
      responsibilities,
      requirements,
      benefits,
      skills,
      status,
    } = req.body;

    // Support old "type" field
    const finalEmploymentType = employmentType || type;

    if (
      !title ||
      !finalEmploymentType ||
      !location ||
      !experience ||
      !shortDescription ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Create slug
    let slug = makeSlug(title);

    const existing = await Career.findOne({
      slug,
    });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const career = await Career.create({
      title,
      slug,

      employmentType: finalEmploymentType,

      location,

      experience,

      salary: salary || "",

      shortDescription,

      description,

      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
            .map((item) => String(item).trim())
            .filter(Boolean)
        : [],

      requirements: Array.isArray(requirements)
        ? requirements
            .map((item) => String(item).trim())
            .filter(Boolean)
        : [],

      benefits: Array.isArray(benefits)
        ? benefits
            .map((item) => String(item).trim())
            .filter(Boolean)
        : [],

      skills: Array.isArray(skills)
        ? skills
            .map((item) => String(item).trim())
            .filter(Boolean)
        : [],

      status: status || "active",
    });

    res.status(201).json({
      success: true,
      message: "Career created successfully",
      career,
    });
  } catch (error) {
    console.error("CREATE CAREER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create career",
    });
  }
}

// =========================================================
// UPDATE CAREER
// =========================================================

export async function updateCareer(req, res) {
  try {
    const {
      title,
      type,
      employmentType,
      location,
      experience,
      salary,
      shortDescription,
      description,
      responsibilities,
      requirements,
      benefits,
      skills,
      status,
    } = req.body;

    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    // Support old "type" field
    const finalEmploymentType =
      employmentType ||
      type ||
      career.employmentType ||
      career.type ||
      "Full-time";

    // ---------------------------------------------------------
    // Update slug if title changed
    // ---------------------------------------------------------

    if (title && title !== career.title) {
      let newSlug = makeSlug(title);

      const duplicate = await Career.findOne({
        slug: newSlug,
        _id: {
          $ne: career._id,
        },
      });

      if (duplicate) {
        newSlug = `${newSlug}-${Date.now()}`;
      }

      career.slug = newSlug;
      career.title = title;
    }

    // ---------------------------------------------------------
    // Update fields
    // ---------------------------------------------------------

    career.employmentType = finalEmploymentType;

    if (location !== undefined) {
      career.location = location;
    }

    if (experience !== undefined) {
      career.experience = experience;
    }

    // IMPORTANT:
    // Do not erase existing salary if salary wasn't
    // included in the update request.
    if (salary !== undefined) {
      career.salary = salary;
    }

    if (shortDescription !== undefined) {
      career.shortDescription = shortDescription;
    }

    if (description !== undefined) {
      career.description = description;
    }

    if (Array.isArray(responsibilities)) {
      career.responsibilities = responsibilities
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    if (Array.isArray(requirements)) {
      career.requirements = requirements
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    if (Array.isArray(benefits)) {
      career.benefits = benefits
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    if (Array.isArray(skills)) {
      career.skills = skills
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    if (status !== undefined) {
      career.status = status;
    }

    await career.save();

    res.json({
      success: true,
      message: "Career updated successfully",
      career,
    });
  } catch (error) {
    console.error("UPDATE CAREER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update career",
    });
  }
}

// =========================================================
// DELETE CAREER
// =========================================================

export async function deleteCareer(req, res) {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    // Delete applications belonging to this career
    await CareerApplication.deleteMany({
      career: career._id,
    });

    await career.deleteOne();

    res.json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CAREER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete career",
    });
  }
}

// =========================================================
// TOGGLE CAREER STATUS
// =========================================================

export async function toggleCareerStatus(req, res) {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    if (career.status === "active") {
      career.status = "closed";
    } else {
      career.status = "active";
    }

    await career.save();

    res.json({
      success: true,

      message:
        career.status === "active"
          ? "Career activated"
          : "Career closed",

      career,
    });
  } catch (error) {
    console.error("TOGGLE CAREER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update status",
    });
  }
}

// =========================================================
// SUBMIT CAREER APPLICATION
// =========================================================

export async function submitCareerApplication(req, res) {
  try {
    // Get user from JWT
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to apply",
      });
    }

    const {
      careerId,
      name,
      email,
      phone,
      linkedin,
      github,
      resume,
      coverLetter,
    } = req.body;

    if (!careerId || !name || !email || !resume) {
      return res.status(400).json({
        success: false,
        message: "Name, email, resume and career are required",
      });
    }

    // Check career
    const career = await Career.findOne({
      _id: careerId,
      status: "active",
    });

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "This career position is no longer available",
      });
    }

    // ---------------------------------------------------------
    // Prevent duplicate application
    // ---------------------------------------------------------

    const existingApplication =
      await CareerApplication.findOne({
        user: userId,
        career: career._id,
      });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this position",
        applicationId: existingApplication._id,
      });
    }

    // ---------------------------------------------------------
    // Create application
    // ---------------------------------------------------------

    const application = await CareerApplication.create({
      user: userId,

      career: career._id,

      name: name.trim(),

      email: email.trim().toLowerCase(),

      phone: phone || "",

      linkedin: linkedin || "",

      github: github || "",

      resume: resume.trim(),

      coverLetter: coverLetter || "",

      status: "pending",
    });

    res.status(201).json({
      success: true,

      message: "Application submitted successfully",

      applicationId: application._id,

      application,
    });
  } catch (error) {
    console.error(
      "SUBMIT CAREER APPLICATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit application",
    });
  }
}

// =========================================================
// MY CAREER APPLICATIONS
// =========================================================

export async function getMyCareerApplications(req, res) {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }

    // IMPORTANT:
    // submitCareerApplication saves the field as "user",
    // so we must query "user" here as well.
    const applications = await CareerApplication.find({
      user: userId,
    })
      .populate(
        "career",
        "title slug department location employmentType experience salary"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(
      "GET MY CAREER APPLICATIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch career applications",
    });
  }
}

// =========================================================
// ADMIN APPLICATIONS
// =========================================================

// Get all applications
export async function getApplications(req, res) {
  try {
    const applications = await CareerApplication.find()
      .populate(
        "career",
        "title slug employmentType location"
      )
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(
      "GET APPLICATIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
}

// =========================================================
// UPDATE APPLICATION STATUS
// =========================================================

export async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewing",
      "shortlisted",
      "rejected",
      "hired",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Application status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const application =
      await CareerApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;

    await application.save();

    // Return updated data
    const updatedApplication =
      await CareerApplication.findById(id)
        .populate(
          "career",
          "title slug employmentType location"
        )
        .populate(
          "user",
          "name email"
        );

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(
      "UPDATE APPLICATION STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update application status",
    });
  }
}

// =========================================================
// DELETE APPLICATION
// =========================================================

export async function deleteApplication(req, res) {
  try {
    const application =
      await CareerApplication.findById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await application.deleteOne();

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE APPLICATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete application",
    });
  }
}

// =========================================================
// ADMIN DASHBOARD STATS
// =========================================================

export async function getAdminStats(req, res) {
  try {
    const [
      totalCareers,
      activeCareers,
      closedCareers,
      draftCareers,
      totalApplications,
      pendingApplications,
      reviewingApplications,
      shortlistedApplications,
      hiredApplications,
    ] = await Promise.all([
      Career.countDocuments(),

      Career.countDocuments({
        status: "active",
      }),

      Career.countDocuments({
        status: "closed",
      }),

      Career.countDocuments({
        status: "draft",
      }),

      CareerApplication.countDocuments(),

      CareerApplication.countDocuments({
        status: "pending",
      }),

      CareerApplication.countDocuments({
        status: "reviewing",
      }),

      CareerApplication.countDocuments({
        status: "shortlisted",
      }),

      CareerApplication.countDocuments({
        status: "hired",
      }),
    ]);

    res.json({
      success: true,

      stats: {
        totalCareers,
        activeCareers,
        closedCareers,
        draftCareers,

        totalApplications,

        pendingApplications,

        reviewingApplications,

        shortlistedApplications,

        hiredApplications,
      },
    });
  } catch (error) {
    console.error(
      "GET ADMIN STATS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard statistics",
    });
  }
}