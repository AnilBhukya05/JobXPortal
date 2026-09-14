import { useEffect } from "react";

export default function JobPostingSchema({ job }) {
  useEffect(() => {
    if (!job || job.source !== "JobXPortal") {
      return;
    }

    const scriptId = "jobxportal-jobposting-schema";

    const existing = document.getElementById(scriptId);

    if (existing) {
      existing.remove();
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title,
      description: job.description,
      datePosted: job.datePosted || job.createdAt,
      hiringOrganization: {
        "@type": "Organization",
        name: job.company,
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.location,
          addressCountry: "IN",
        },
      },
    };

    if (job.validThrough) {
      schema.validThrough = job.validThrough;
    }

    if (job.employmentType) {
      schema.employmentType = job.employmentType;
    }

    const script = document.createElement("script");

    script.id = scriptId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);

    document.head.appendChild(script);

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [job]);

  return null;
}