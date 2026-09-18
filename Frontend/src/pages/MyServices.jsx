import React from "react";
import { useEffect } from "react";
import {
  Code2,
  ShoppingCart,
  Palette,
  Monitor,
  Smartphone,
  Settings,
  CheckCircle2,
  ArrowUpRight,
  MessageCircle,
  Layers3,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| SERVICE REQUEST FORM
|--------------------------------------------------------------------------
| Replace this with your actual Google Form / Typeform / other form URL.
| You only need to change it here once.
|--------------------------------------------------------------------------
*/

const FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSc0OY7c9Mk869LPPB3-uWKubX5hwiBiohABrmICrsI7wG8EHw/viewform?usp=publish-editor";

const services = [
  {
    icon: Code2,
    title: "Website Development",
    shortDescription:
      "Professional, responsive websites for businesses, startups, portfolios, and personal brands.",

    description:
      "I design and develop modern websites that work smoothly on mobile, tablet, and desktop devices. Whether you need a business website, portfolio, landing page, company website, or personal website, I can build a solution based on your goals and requirements.",

    includes: [
      "Responsive design for mobile, tablet, and desktop",
      "Modern and professional user interface",
      "Multiple pages and sections",
      "Contact and enquiry forms",
      "SEO-friendly website structure",
      "Website deployment and basic setup",
    ],

    suitableFor:
      "Businesses, startups, freelancers, students, professionals, creators, and personal brands.",
  },

  {
    icon: ShoppingCart,
    title: "E-Commerce Websites",
    shortDescription:
      "Online stores that help businesses showcase products and accept orders online.",

    description:
      "I build e-commerce websites where customers can browse products, view details, add items to a cart, and complete purchases. The website can also include an admin panel for managing products, orders, and other store information.",

    includes: [
      "Product and category pages",
      "Shopping cart functionality",
      "Checkout system",
      "Payment gateway integration",
      "Order management",
      "Admin dashboard",
    ],

    suitableFor:
      "Retail stores, local businesses, small businesses, startups, entrepreneurs, and product-based brands.",
  },

  {
    icon: Monitor,
    title: "Web Application Development",
    shortDescription:
      "Custom web applications developed around your business idea or specific workflow.",

    description:
      "If you need more than a normal website, I can develop a custom web application. Applications can include user accounts, dashboards, authentication, databases, APIs, forms, admin panels, and other features required for your project.",

    includes: [
      "Custom application development",
      "User registration and login",
      "User dashboards",
      "Database integration",
      "REST API integration",
      "Admin functionality",
    ],

    suitableFor:
      "Startups, businesses, organizations, educational projects, and entrepreneurs with custom digital ideas.",
  },

  {
    icon: Palette,
    title: "UI/UX & Website Design",
    shortDescription:
      "Clean and user-friendly interfaces designed to make your website look modern and professional.",

    description:
      "I create modern website interfaces with a focus on usability, visual consistency, responsive layouts, spacing, typography, and user experience. If you already have a website but want a better design, I can help redesign and improve the interface.",

    includes: [
      "Website layout design",
      "Landing page design",
      "Responsive UI design",
      "Modern typography and spacing",
      "User-friendly navigation",
      "Website redesign",
    ],

    suitableFor:
      "Businesses, startups, portfolios, creators, developers, and existing websites that need a design improvement.",
  },

  {
    icon: Smartphone,
    title: "Landing Page Development",
    shortDescription:
      "Focused landing pages designed to present your product, service, business, or campaign.",

    description:
      "I create focused landing pages that clearly explain your product or service and guide visitors toward an action such as contacting you, submitting an enquiry, booking a service, registering, or purchasing a product.",

    includes: [
      "Modern landing page design",
      "Mobile responsiveness",
      "Clear call-to-action sections",
      "Contact or enquiry forms",
      "Performance-focused structure",
      "Deployment support",
    ],

    suitableFor:
      "Marketing campaigns, startups, products, services, businesses, creators, and personal brands.",
  },

  {
    icon: Settings,
    title: "Website Maintenance & Support",
    shortDescription:
      "Ongoing technical support, updates, improvements, and bug fixes for your website.",

    description:
      "Already have a website but need someone to maintain or improve it? I can help with content updates, UI changes, fixing website issues, adding features, improving existing sections, and deployment-related tasks.",

    includes: [
      "Website content updates",
      "Bug fixing",
      "UI improvements",
      "New feature updates",
      "Performance improvements",
      "Deployment and technical support",
    ],

    suitableFor:
      "Businesses, professionals, creators, and individuals who already have a website and need ongoing support.",
  },
];

function ServiceCard({ service }) {
  const Icon = service.icon;

  return (
    <article
      className="
        group flex flex-col
        rounded-[18px]
        border border-[#E2E6F0]
        bg-white
        p-[30px]
        shadow-[0_3px_14px_rgba(15,23,42,0.025)]
        transition-all duration-300
        hover:-translate-y-[5px]
        hover:border-indigo-600/30
        hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)]
        max-[640px]:rounded-[15px]
        max-[640px]:p-[23px]
      "
    >
      {/* Icon */}
      <div
        className="
          flex h-[52px] w-[52px]
          items-center justify-center
          rounded-[13px]
          border border-indigo-600/10
          bg-[#F0EFFF]
          text-indigo-600
          transition-all duration-300
          group-hover:-translate-y-[2px]
          group-hover:bg-indigo-600
          group-hover:text-white
        "
      >
        <Icon size={25} strokeWidth={1.8} />
      </div>

      {/* Title */}
      <h3
        className="
          mt-[21px]
          text-[22px]
          font-[750]
          leading-[1.3]
          tracking-[-0.025em]
          text-[#0B132B]
          max-[640px]:text-[20px]
        "
      >
        {service.title}
      </h3>

      {/* Short description */}
      <p
        className="
          mt-[10px]
          text-[14px]
          font-semibold
          leading-[1.7]
          text-[#475569]
        "
      >
        {service.shortDescription}
      </p>

      {/* Detailed description */}
      <p
        className="
          mt-[15px]
          text-[13px]
          leading-[1.8]
          text-[#64748B]
        "
      >
        {service.description}
      </p>

      {/* Included */}
      <div className="mt-[25px]">
        <h4
          className="
            mb-[13px]
            text-[13px]
            font-bold
            text-[#0B132B]
          "
        >
          What's included
        </h4>

        <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
          {service.includes.map((item, index) => (
            <li
              key={index}
              className="
                flex
                items-start
                gap-[9px]
                text-[13px]
                leading-[1.5]
                text-[#64748B]
              "
            >
              <CheckCircle2
                size={17}
                strokeWidth={2}
                className="
                  mt-[1px]
                  shrink-0
                  text-indigo-600
                "
              />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suitable for */}
      <div
        className="
          mt-[24px]
          border-t border-[#EEF1F6]
          pt-[19px]
        "
      >
        <span
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-[#94A3B8]
          "
        >
          Suitable for
        </span>

        <p
          className="
            mt-[7px]
            text-[12px]
            leading-[1.7]
            text-[#64748B]
          "
        >
          {service.suitableFor}
        </p>
      </div>

      {/* Button */}
      <a
  href={FORM_LINK}
  target="_blank"
  rel="noopener noreferrer"
  className="
    group/button
    relative
    mt-[25px]
    flex
    items-center
    justify-between
    gap-[10px]
    overflow-hidden
    rounded-[10px]
    border border-indigo-600
    bg-white
    px-[15px]
    py-[12px]
    text-[13px]
    font-bold
    text-indigo-600
    no-underline
    transition-all
    duration-300
    hover:-translate-y-[2px]
    hover:shadow-[0_8px_18px_rgba(79,70,229,0.16)]
  "
>
  {/* Left → Right blue fill */}
  <span
    className="
      absolute
      inset-y-0
      left-0
      w-full
      origin-left
      scale-x-0
      bg-indigo-600
      transition-transform
      duration-500
      ease-out
      group-hover/button:scale-x-100
    "
  />

  {/* Text */}
  <span
    className="
      relative
      z-10
      transition-colors
      duration-300
      group-hover/button:text-white
    "
  >
    Request This Service
  </span>

  {/* Arrow */}
  <ArrowUpRight
    size={18}
    strokeWidth={2}
    className="
      relative
      z-10
      transition-colors
      duration-300
      group-hover/button:text-white
    "
  />
</a>
    </article>
  );
}

export default function MyServices() {
  useEffect(() => {
    document.title = "My Services — Anil Bhukya";

    return () => {
      document.title = "JobXPortal — Find Jobs, Hire Talent";
    };
  }, []);

  return (
    <div
      className="
        min-h-screen
        bg-[#F8FAFF]
        text-[#0B132B]
        [font-family:Poppins,sans-serif]
      "
    >
      {/* HERO */}

      <section
        className="
          border-b border-[#E2E6F0]
          bg-white
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1180px]
            px-6
            py-[82px]
            max-[640px]:px-[18px]
            max-[640px]:py-[60px]
          "
        >
          <div
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-indigo-600
            "
          >
            MY SERVICES
          </div>

          <h1
            className="
              mt-[15px]
              max-w-[850px]
              text-[clamp(40px,5vw,64px)]
              font-extrabold
              leading-[1.08]
              tracking-[-0.045em]
              text-[#0B132B]
            "
          >
            Digital solutions built
            <br />
            around your ideas.
          </h1>

          <p
            className="
              mt-[25px]
              max-w-[720px]
              text-[17px]
              leading-[1.8]
              text-[#64748B]
              max-[640px]:text-[15px]
            "
          >
            I design and develop modern websites, web applications, and digital
            solutions for businesses, startups, professionals, students, and
            individuals.
          </p>

          <a
            href={FORM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group/hero
              relative
              mt-[30px]
              inline-flex
              items-center
              justify-center
              gap-[9px]
              overflow-hidden
              rounded-[10px]
              border border-indigo-600
              bg-indigo-600
              px-[21px]
              py-[13px]
              text-[14px]
              font-bold
              text-white
              no-underline
              shadow-[0_7px_18px_rgba(79,70,229,0.16)]
              transition-all duration-300
              hover:-translate-y-[2px]
              hover:shadow-[0_11px_25px_rgba(79,70,229,0.22)]
              max-[640px]:w-full
              before:absolute
              before:inset-0
              before:origin-left
              before:scale-x-0
              before:bg-[#3730A3]
              before:transition-transform
              before:duration-[350ms]
              before:ease-out
              group-hover/hero:before:scale-x-100
            "
          >
            <span
              className="
                relative
                z-10
                text-white
              "
            >
              Tell Me About Your Project
            </span>

            <ArrowUpRight
              size={18}
              strokeWidth={2}
              className="
                relative
                z-10
                text-white
              "
            />
          </a>
        </div>
      </section>

      {/* SERVICES */}

      <main
        className="
          py-[80px]
          max-[640px]:py-[60px]
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1180px]
            px-6
            max-[640px]:px-[18px]
          "
        >
          {/* Section heading */}

          <div
            className="
              mb-[42px]
              flex
              items-end
              justify-between
              gap-10
              max-[900px]:flex-col
              max-[900px]:items-start
              max-[900px]:gap-6
              max-[900px]:mb-[42px]
              max-[640px]:mb-[30px]
            "
          >
            <div>
              <div
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-indigo-600
                "
              >
                WHAT I OFFER
              </div>

              <h2
                className="
                  mt-[10px]
                  text-[36px]
                  font-extrabold
                  leading-[1.2]
                  tracking-[-0.035em]
                  text-[#0B132B]
                  max-[640px]:text-[29px]
                "
              >
                Services for your next
                <br className="max-[640px]:hidden" />
                digital project
              </h2>
            </div>

            <p
              className="
                m-0
                max-w-[390px]
                text-[14px]
                leading-[1.8]
                text-[#64748B]
                max-[900px]:max-w-[600px]
              "
            >
              Choose a service that matches your requirements, or contact me if
              you have a custom idea.
            </p>
          </div>

          {/* Service cards */}

          <div
            className="
              grid
              grid-cols-2
              gap-[22px]
              max-[900px]:grid-cols-1
            "
          >
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                service={service}
              />
            ))}
          </div>
        </div>
      </main>

      {/* CUSTOM PROJECT CTA */}

      <section
        className="
          border-t border-[#E2E6F0]
          bg-white
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1180px]
            px-6
            max-[640px]:px-[18px]
          "
        >
          <div
            className="
              flex
              items-start
              gap-[28px]
              py-[75px]
              max-[640px]:flex-col
              max-[640px]:gap-5
              max-[640px]:py-[60px]
            "
          >
            <div
              className="
                flex
                h-[56px]
                w-[56px]
                shrink-0
                items-center
                justify-center
                rounded-[14px]
                border border-indigo-600/10
                bg-[#F0EFFF]
                text-indigo-600
              "
            >
              <Layers3
                size={27}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <div
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-indigo-600
                "
              >
                HAVE A DIFFERENT IDEA?
              </div>

              <h2
                className="
                  mt-[10px]
                  text-[36px]
                  font-extrabold
                  leading-[1.2]
                  tracking-[-0.035em]
                  text-[#0B132B]
                  max-[640px]:text-[29px]
                "
              >
                Let's build something
                <br className="max-[640px]:hidden" />
                that fits your needs.
              </h2>

              <p
                className="
                  mt-[18px]
                  max-w-[650px]
                  text-[14px]
                  leading-[1.8]
                  text-[#64748B]
                "
              >
                If your project doesn't exactly match the services listed
                above, that's completely fine. Tell me about your idea,
                requirements, budget, and timeline, and I'll review your
                project.
              </p>

              <a
                href={FORM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group/hero2
                  relative
                  mt-[30px]
                  inline-flex
                  items-center
                  justify-center
                  gap-[9px]
                  overflow-hidden
                  rounded-[10px]
                  border border-indigo-600
                  bg-indigo-600
                  px-[21px]
                  py-[13px]
                  text-[14px]
                  font-bold
                  text-white
                  no-underline
                  shadow-[0_7px_18px_rgba(79,70,229,0.16)]
                  transition-all duration-300
                  hover:-translate-y-[2px]
                  hover:shadow-[0_11px_25px_rgba(79,70,229,0.22)]
                  max-[640px]:w-full
                  before:absolute
                  before:inset-0
                  before:origin-left
                  before:scale-x-0
                  before:bg-[#3730A3]
                  before:transition-transform
                  before:duration-[350ms]
                  before:ease-out
                  group-hover/hero2:before:scale-x-100
                "
              >
                <span
                  className="
                    relative
                    z-10
                    text-white
                  "
                >
                  Tell Me About Your Project
                </span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={2}
                  className="
                    relative
                    z-10
                    text-white
                  "
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}