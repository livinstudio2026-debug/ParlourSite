// src/config/navigationConfig.ts

export const NAV_ITEMS = [
  { label: "Home",         id: "home"         },
  { label: "About",        id: "about"        },
  { label: "Services",     id: "services"     },
  { label: "Gallery",      id: "gallery"      },
  { label: "Pricing",      id: "pricing"      },
  { label: "Testimonials", id: "testimonials" },
  { label: "Contact",      id: "contact"      },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];
