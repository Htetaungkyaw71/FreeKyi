import { Link } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { SEO } from "../components/seo/SEO";
import { seoConfig } from "../components/seo/config";
import { contactEmail, sameAsLinks, socialLinks } from "../data/socialLinks";

const contactOptions = [
  {
    title: "Email",
    description:
      "Send support messages, removal requests, and detailed reports by email.",
    href: socialLinks.email,
    icon: Mail,
  },
  {
    title: "Telegram",
    description:
      "Join or message through Telegram for quick reports, updates, and community feedback.",
    href: socialLinks.telegram,
    icon: Send,
  },
  {
    title: "Facebook",
    description:
      "Follow FreeKyi on Facebook for updates, announcements, and general contact.",
    href: socialLinks.facebook,
    icon: MessageCircle,
  },
];

const reportTypes = [
  "Broken poster or cast image",
  "Wrong movie or series information",
  "Playback or iframe problem",
  "Bookmark or continue watching issue",
  "Content or removal request",
];

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact FreeKyi"
        description="Contact FreeKyi through Telegram, Facebook, or email for support, feedback, broken links, image issues, and removal requests."
        path="/contact"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact FreeKyi",
          description:
            "Contact FreeKyi through Telegram, Facebook, or email for support, feedback, broken links, image issues, and removal requests.",
          url: `${seoConfig.siteUrl}/contact`,
          mainEntity: {
            "@type": "Organization",
            name: seoConfig.siteName,
            url: seoConfig.siteUrl,
            logo: `${seoConfig.siteUrl}/web-app-manifest-512x512.png`,
            email: contactEmail,
            contactPoint: {
              "@type": "ContactPoint",
              email: contactEmail,
              contactType: "customer support",
            },
            sameAs: sameAsLinks,
          },
        }}
      />

      <div className="min-h-screen bg-cinema-bg px-4 py-24 md:px-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cinema-accent/30 bg-cinema-accent/10 px-3 py-1 text-xs font-body font-semibold uppercase tracking-widest text-cinema-accent">
              <ShieldCheck className="h-3.5 w-3.5" />
              Contact
            </div>
            <h1 className="font-display text-4xl leading-none text-white md:text-6xl">
              Contact FreeKyi
            </h1>
            <p className="mt-5 text-base leading-relaxed text-cinema-text md:text-lg">
              Send feedback, report broken pages, request title corrections, or
              contact FreeKyi about removal requests.
            </p>
            <a
              href={socialLinks.email}
              className="mt-5 inline-flex text-sm font-body font-semibold text-cinema-accent transition hover:text-white"
            >
              {contactEmail}
            </a>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {contactOptions.map(({ description, href, icon: Icon, title }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-lg border border-cinema-border bg-cinema-card p-6 transition hover:-translate-y-0.5 hover:border-cinema-accent/70"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cinema-hover text-cinema-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-white">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-cinema-muted md:text-base">
                  {description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-body font-semibold text-cinema-accent">
                  Open {title}
                  <ExternalLink className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-lg border border-cinema-border bg-cinema-card p-6 md:p-8">
              <h2 className="font-display text-3xl text-white">
                What to Include
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-cinema-muted">
                When reporting a problem, include the page link, title name,
                device, browser, and a short description. Screenshots help a lot.
              </p>
              <ul className="mt-5 space-y-3">
                {reportTypes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-cinema-text"
                  >
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cinema-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-cinema-border bg-cinema-card p-6 md:p-8">
              <h2 className="font-display text-3xl text-white">
                Removal Requests
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-cinema-muted md:text-base">
                <p>
                  If you need to report content or request a page review,
                  contact FreeKyi through email, Telegram, or Facebook with the
                  affected URL and enough detail to understand the request.
                </p>
                <p>
                  FreeKyi aims to respond to valid reports and keep title pages,
                  images, and discovery information accurate for users.
                </p>
              </div>
              <Link
                to="/about"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-cinema-border bg-cinema-hover px-5 py-3 text-sm font-body font-semibold text-white transition hover:border-cinema-accent"
              >
                About FreeKyi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
