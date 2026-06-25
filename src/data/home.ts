export const homeContent = {
  meta: {
    title: "HBH Portfolio",
    description:
      "Research projects, engineering work, and technical notes."
  },
  front: {
    kicker: "RESEARCH / ENGINEERING / NOTES",
    hiddenTitle: "HBH robotics, vision, and data science portfolio",
    image: "/assets/front.webp",
    imageAlt: "A front image representing the homepage visual statement.",
    role: "Physical AI, Robotics, Computer Vision, and Data Science.",
    summaryPrefix:
      "A working archive of selected systems, research output, implementation notes, and technical experiments maintained by"
  },
  actions: [
    { label: "Explore projects", href: "/projects/", variant: "primary" },
    { label: "Read notes", href: "/note/", variant: "secondary" }
  ],
  stats: {
    projectsLabel: "Projects",
    projectsSuffix: "documented systems",
    notesLabel: "Notes",
    notesSuffix: "technical entries",
    profileLabel: "Profile",
    profileText: "CV and research record",
    profileHref: "/about/"
  },
  directory: {
    eyebrow: "SITE INDEX",
    code: "001",
    items: [
      {
        number: "01",
        label: "Projects",
        href: "/projects/",
        description: "Robotics, vision, ML, and deployed systems"
      },
      {
        number: "02",
        label: "Notes",
        href: "/note/",
        description: "Research logs, case reports, and implementation guides"
      },
      {
        number: "03",
        label: "CV",
        href: "/about/",
        description: "Education, experience, publications, and awards"
      }
    ],
    ownerLabel: "Maintained by"
  },
  sections: {
    projects: {
      kicker: "PROJECTS",
      title: "Selected Projects",
      actionLabel: "All projects",
      actionHref: "/projects/"
    },
    notes: {
      kicker: "WRITING",
      title: "Notes",
      actionLabel: "All notes",
      actionHref: "/note/"
    }
  }
};
