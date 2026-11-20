// Service catalogue.
// `published: false` hides a category from the website — keep a category hidden
// until you have confirmed Nexovate can deliver it (directly or via an approved partner).
// No prices are listed here on purpose: pricing is given through custom quotes.

export type ServiceIcon =
  | "code"
  | "wordpress"
  | "cart"
  | "smartphone"
  | "cpu"
  | "search"
  | "share"
  | "palette"
  | "bot"
  | "video";

export interface ServiceCategory {
  slug: string;
  title: string;
  icon: ServiceIcon;
  summary: string;
  description: string;
  offerings: string[];
  published: boolean;
}

export const services: ServiceCategory[] = [
  {
    slug: "web-development",
    title: "Web Development",
    icon: "code",
    summary: "Fast, secure and scalable websites and web applications built around your goals.",
    description:
      "From business websites to complex web applications, we plan, design and engineer sites that load fast, rank well and are easy to maintain.",
    offerings: [
      "Custom Website Development",
      "Business & Corporate Websites",
      "Landing Page Development",
      "Frontend, Backend & Full-Stack Development",
      "Web Application Development",
      "Website Redesign",
      "Website Maintenance",
    ],
    published: true,
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    icon: "wordpress",
    summary: "Custom WordPress sites, themes and plugins that your team can manage with ease.",
    description:
      "We build WordPress websites that are flexible for your team and solid under the hood — custom themes, plugins, performance and security.",
    offerings: [
      "Custom WordPress Websites",
      "Theme Development",
      "Plugin Development",
      "Elementor Development",
      "WooCommerce Development",
      "Performance Optimization",
      "Security & Maintenance",
    ],
    published: true,
  },
  {
    slug: "ecommerce-development",
    title: "E-commerce Development",
    icon: "cart",
    summary: "Online stores on Shopify, WooCommerce or custom platforms — built to convert.",
    description:
      "We set up and grow online stores with clean product catalogues, smooth checkouts and the right payment integrations for your markets.",
    offerings: [
      "Shopify Store Development",
      "WooCommerce Store Development",
      "Custom E-commerce Platforms",
      "Store Setup & Configuration",
      "Payment Gateway Integration",
      "Product Catalogue Setup",
      "E-commerce Migration",
      "Checkout Optimization",
    ],
    published: true,
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    icon: "smartphone",
    summary: "Android, iOS and cross-platform apps with clean design and reliable backends.",
    description:
      "We design and develop mobile apps that feel native, perform well and connect to dependable backend systems.",
    offerings: [
      "Android App Development",
      "iOS App Development",
      "Cross-Platform Applications",
      "Mobile UI/UX Design",
      "Mobile Backend Development",
      "App Maintenance & Support",
    ],
    published: true,
  },
  {
    slug: "custom-software",
    title: "Custom Software & IT Solutions",
    icon: "cpu",
    summary: "CRMs, ERPs, internal tools and APIs tailored to the way your business works.",
    description:
      "When off-the-shelf tools don't fit, we build software around your processes — from CRMs and dashboards to integrations and cloud apps.",
    offerings: [
      "Custom Software Development",
      "CRM Development",
      "ERP Solutions",
      "Business Management Systems",
      "API Development & Integration",
      "Database Design",
      "Cloud-Based Applications",
      "Internal Business Tools",
    ],
    published: true,
  },
  {
    slug: "digital-marketing-seo",
    title: "Digital Marketing & SEO",
    icon: "search",
    summary: "Search, paid campaigns and content that bring the right visitors to your business.",
    description:
      "We improve how customers find you — technical and international SEO, paid search and conversion-focused content.",
    offerings: [
      "Technical SEO",
      "On-Page & Off-Page SEO",
      "Local & International SEO",
      "E-commerce SEO",
      "Search Engine Marketing",
      "PPC Campaign Management",
      "Content Marketing",
      "Conversion Rate Optimization",
    ],
    published: true,
  },
  {
    slug: "social-media-management",
    title: "Social Media Management",
    icon: "share",
    summary: "Strategy, content and community management across the platforms that matter.",
    description:
      "We plan, create and manage social content and ads that keep your brand consistent and your audience engaged.",
    offerings: [
      "Social Media Strategy",
      "Account Management",
      "Content Planning & Creation",
      "Post Scheduling",
      "Community Management",
      "Social Media Advertising",
      "Performance Reporting",
    ],
    published: true,
  },
  {
    slug: "graphic-design-branding",
    title: "Graphic Design & Branding",
    icon: "palette",
    summary: "Logos, brand identities and visuals that make your business recognisable.",
    description:
      "We create brand identities and design assets that look consistent everywhere — from your logo to your social posts and presentations.",
    offerings: [
      "Logo Design",
      "Brand Identity & Guidelines",
      "Social Media Graphics",
      "Marketing Materials",
      "UI/UX Design",
      "Presentation Design",
    ],
    published: true,
  },
  {
    slug: "ai-automation",
    title: "AI & Business Automation",
    icon: "bot",
    summary: "AI chatbots, integrations and workflow automation that save your team time.",
    description:
      "We connect AI and automation to your existing tools so repetitive work runs on its own and your team can focus on growth.",
    offerings: [
      "AI Chatbot Development",
      "AI Integration",
      "Workflow Automation",
      "CRM Automation",
      "Business Process Automation",
      "Custom AI Solutions",
    ],
    published: true,
  },
  {
    slug: "video-content-production",
    title: "Video Editing & Content",
    icon: "video",
    summary: "Short-form videos, reels and promotional content built for social platforms.",
    description:
      "We edit and produce video content that stops the scroll — reels, shorts, product videos and motion graphics.",
    offerings: [
      "Short-Form Video Editing",
      "Reels & Shorts",
      "Promotional Videos",
      "Product Videos",
      "Motion Graphics",
    ],
    published: true,
  },
];

export const publishedServices = services.filter((s) => s.published);

export function getService(slug: string) {
  return publishedServices.find((s) => s.slug === slug);
}
