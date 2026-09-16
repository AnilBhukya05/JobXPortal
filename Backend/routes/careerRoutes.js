import express from "express";

import {
  getPublicCareers,
  getPublicCareer,
  getAdminCareers,
  getAdminCareer,
  createCareer,
  updateCareer,
  deleteCareer,
  toggleCareerStatus,
  submitCareerApplication,
  getApplications,
  getMyCareerApplications,
  updateApplicationStatus,
  deleteApplication,
  getAdminStats,
} from "../controllers/careerController.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

router.get(
  "/admin/dashboard/stats",
  protect,
  adminOnly,
  getAdminStats
);

/* =========================================================
   ADMIN CAREERS
========================================================= */

// Get all careers for admin
router.get(
  "/admin/list",
  protect,
  adminOnly,
  getAdminCareers
);

// Get single career for admin
router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getAdminCareer
);

// Create career
router.post(
  "/admin",
  protect,
  adminOnly,
  createCareer
);

// Update career
router.put(
  "/admin/:id",
  protect,
  adminOnly,
  updateCareer
);

// Delete career
router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteCareer
);

// Toggle career active/inactive
router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  toggleCareerStatus
);

/* =========================================================
   ADMIN APPLICATIONS
========================================================= */

// Get all career applications
router.get(
  "/admin-applications",
  protect,
  adminOnly,
  getApplications
);

// Update application status
router.patch(
  "/admin-applications/:id/status",
  protect,
  adminOnly,
  updateApplicationStatus
);

// Delete application
router.delete(
  "/admin-applications/:id",
  protect,
  adminOnly,
  deleteApplication
);

/* =========================================================
   SEEKER / USER APPLICATIONS
========================================================= */

// Get logged-in user's career applications
router.get(
  "/my-applications",
  protect,
  getMyCareerApplications
);

// Submit career application
router.post(
  "/apply",
  protect,
  submitCareerApplication
);

/* =========================================================
   PUBLIC CAREERS
========================================================= */

// Get all public careers
router.get(
  "/",
  getPublicCareers
);

// Get single public career by slug
router.get(
  "/:slug",
  getPublicCareer
);

export default router;