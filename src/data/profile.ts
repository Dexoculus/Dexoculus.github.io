export const profile = {
  siteTitle: "HBH Portfolio",
  name: "Hyeonbin Han",
  handle: "Dexter Oculus",
  brandLine: "Robot Learning / Physical AI",
  role: "Undergraduate Researcher in Robot Learning and Physical AI",
  location: "Republic of Korea",
  email: "hyeonbin@hanyang.ac.kr",
  avatar: "https://avatars.githubusercontent.com/u/34956179?v=4",
  summary:
    "Undergraduate researcher in robot learning and physical AI, with hands-on experience in real-world robot manipulation, imitation learning, teleoperation, and robotic learning systems.",
  focus: ["Robot Learning", "Robot Manipulation", "Imitation Learning", "Reinforcement Learning", "Sim-to-Real"],
  researchInterests: ["Robot Learning", "Robot Manipulation", "Imitation Learning", "Reinforcement Learning", "Sim-to-Real"],
  skillGroups: [
    {
      label: "Robot Learning",
      scope: "policy development",
      items: ["PyTorch", "Hugging Face LeRobot", "ACT", "Diffusion Policy", "SmolVLA"]
    },
    {
      label: "Robot Platforms & Teleoperation",
      scope: "hands-on platforms",
      items: ["GELLO", "UR5", "ROBOTIS FFW-SG2"]
    },
    {
      label: "Systems",
      scope: "development infrastructure",
      items: ["Python", "Linux", "Docker", "Git"]
    },
    {
      label: "Perception",
      scope: "computer vision",
      items: ["YOLOv8", "3D Vision", "NumPy"]
    },
    {
      label: "3D Tools",
      scope: "prototyping",
      items: ["Fusion 360", "FreeCAD", "3D Printing"]
    }
  ],
  stack: [
    "Python",
    "C++",
    "SQL",
    "PyTorch",
    "Hugging Face LeRobot",
    "NumPy",
    "Pandas",
    "Scikit-learn",
    "Matplotlib",
    "Streamlit",
    "Linux",
    "Docker",
    "Git",
    "Cloudflare Tunnels"
  ],
  links: [
    { label: "GitHub", href: "https://github.com/Dexoculus" },
    { label: "ORCID", href: "https://orcid.org/0009-0007-4713-5892" },
    { label: "PyPI", href: "https://pypi.org/user/dexoculus/" },
    { label: "Scholar", href: "https://scholar.google.com/citations?user=EhfNfLAAAAAJ&hl=ko&oi=ao" }
  ],
  education: {
    school: "Hanyang University ERICA",
    program: "B.S. in Mathematical Data Science",
    period: "Expected graduation: February 2027",
    location: "Ansan, Korea",
    gpa: "3.51 / 4.50"
  },
  experience: [
    {
      organization: "CMES Robotics",
      organizationUrl: "https://www.cmesrobotics.ai/",
      location: "Seoul, Korea",
      role: "Junior Research Assistant, Robot Intelligence Team (Humanoid TF)",
      period: "Mar 2026 - Aug 2026",
      bullets: [
        "Built and standardized teleoperation and data-to-deployment workflows for UR5 manipulation using GELLO, LeRobot, ACT, and containerized robot-learning software.",
        "Developed a FastAPI and Next.js GELLO WebUI that unified robot connection, demonstration recording, dataset review, live camera monitoring, and learned-policy deployment.",
        "Designed real-world ACT experiments for dynamic conveyor assembly, sequential manipulation, and contact-rich packing; diagnosed the effects of camera coverage, action horizons, demonstration composition, and checkpoint selection.",
        "Built a Cyclo Lab and Zenoh simulation pipeline for residual RL, collected 30 demonstrations, trained an ACT base policy, and defined a controlled ACT-versus-ACT+PPO evaluation protocol; residual training remains in progress."
      ]
    },
    {
      organization: "Intelligence & Computation Lab, Hanyang University ERICA",
      location: "Ansan, Korea",
      role: "Undergraduate Researcher",
      period: "Oct 2023 - Jan 2026",
      bullets: [
        "Maintained GPU training infrastructure and resource allocation for deep-learning experiments.",
        "Developed preprocessing pipelines for heterogeneous healthcare and mobile-addiction datasets."
      ]
    }
  ],
  publications: [
    "Han, Hyeonbin, et al. \"Prediction of Closed Quotient During Vocal Phonation Using GRU-Type Neural Network with Audio Signals.\" Journal of Information and Communication Convergence Engineering, vol. 22, no. 2, 2024, pp. 145-152."
  ],
  presentations: [
    "\"DMD Method for Analyzing Interactions Between Board Game Players,\" KIICE Fall Conference, 2025. Poster.",
    "\"Deep Learning-Based Algorithm for Analyzing EGG Signals to Predict Closed Quotient Rate,\" KIIS Spring Conference, 2024. Poster."
  ],
  awards: [
    "Excellence Award, Hanyang University ERICA College of Computing Capstone Fair, Jun 2026.",
    "Excellence Award, 2025 Intelligent Robot WE-Meet Project Integrated Competition, Jan 2026.",
    "Bronze Prize (Robot News President's Award), KIICE Physical AI Challenge, Oct 2025.",
    "Best Paper Award, KIICE Fall Conference, Oct 2025."
  ]
};
