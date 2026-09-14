import { useEffect } from "react";

const SITE_URL = "https://jobxportal.vercel.app";

export default function SEO({
  title,
  description,
  path = "/",
  noindex = false,
}) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    const setProperty = (property, content) => {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    const cleanPath = path.replace(/\/+$/, "") || "/";
    const canonicalUrl = `${SITE_URL}${cleanPath}`;

    setMeta("description", description);
    setMeta(
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large"
    );

    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:type", "website");
    setProperty("og:url", canonicalUrl);

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalUrl);
  }, [title, description, path, noindex]);

  return null;
}