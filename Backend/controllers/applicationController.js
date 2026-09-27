import Application from "../models/Application.js";

export async function getApplications(req, res) {
  try {
    const applications = await Application.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({
      message: "Failed to load applications",
      error: err.message,
    });
  }
}

export async function addApplication(req, res) {
  try {
    const {
      jobId,
      title,
      company,
      url,
      source,
      stage,
      bookmarked,
      notes,
      startedAt,
      appliedAt,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "title is required",
      });
    }

    /*
     * Keep one tracker record per user + JobXPortal job.
     *
     * This prevents creating multiple application
     * records when the same user clicks Apply again.
     */
    if (jobId) {
      const existing = await Application.findOne({
        user: req.user._id,
        jobId: String(jobId),
      });

      if (existing) {
        if (company !== undefined) {
          existing.company = company;
        }

        if (url !== undefined) {
          existing.url = url;
        }

        if (source !== undefined) {
          existing.source = source;
        }

        if (stage !== undefined) {
          existing.stage = stage;
        }

        if (startedAt !== undefined) {
          existing.startedAt = startedAt;
        }

        if (appliedAt !== undefined) {
          existing.appliedAt = appliedAt;
        }

        if (bookmarked !== undefined) {
          existing.bookmarked = Boolean(bookmarked);
        }

        if (notes !== undefined) {
          existing.notes = notes;
        }

        await existing.save();

        return res.json({
          application: existing,
          existing: true,
        });
      }
    }

    const application = await Application.create({
      user: req.user._id,

      jobId: jobId
        ? String(jobId)
        : "",

      title,

      company,

      url,

      source,

      stage:
        stage ||
        "saved",

      bookmarked:
        Boolean(bookmarked),

      notes,

      startedAt:
        startedAt ||
        null,

      appliedAt:
        appliedAt ||
        null,
    });

    res.status(201).json({
      application,
    });
  } catch (err) {
    /*
     * Gracefully handle a duplicate user/job record.
     */
    if (
      err?.code === 11000 &&
      req.body?.jobId
    ) {
      try {
        const existing =
          await Application.findOne({
            user: req.user._id,
            jobId: String(
              req.body.jobId
            ),
          });

        if (existing) {
          return res.json({
            application: existing,
            existing: true,
          });
        }
      } catch {
        // Continue to normal error response.
      }
    }

    res.status(500).json({
      message:
        "Failed to add application",

      error:
        err.message,
    });
  }
}

export async function updateApplication(req, res) {
  try {
    const { id } =
      req.params;

    const application =
      await Application.findOneAndUpdate(
        {
          _id: id,
          user: req.user._id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!application) {
      return res.status(404).json({
        message:
          "Application not found",
      });
    }

    res.json({
      application,
    });
  } catch (err) {
    res.status(500).json({
      message:
        "Failed to update application",

      error:
        err.message,
    });
  }
}

export async function deleteApplication(req, res) {
  try {
    const { id } =
      req.params;

    await Application.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    res.json({
      message:
        "Application deleted",
    });
  } catch (err) {
    res.status(500).json({
      message:
        "Failed to delete application",

      error:
        err.message,
    });
  }
}