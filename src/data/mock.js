// ==========================
// Progress (legacy – puedes eliminarlo luego si ya no lo usas)
// ==========================
export const progressSteps = [
  { title: "Apply", status: "completed" },
  { title: "Shift Selection", status: "pending", link: "/shift" },
  { title: "Complete Onboarding Documents", status: "pending" },
  { title: "First Day Preparation", status: "pending" },
  { title: "Pending", status: "pending_new" },
];

// ==========================
// Required Tasks (NUEVO – tabla principal)
// ==========================
export const requiredTasks = [
  {
    id: "rt1",
    title: "Apply",
    desc: "Pre-approved before access",
    status: "completed", // completed | pending | locked
    to: "/progress",
  },
  {
    id: "rt2",
    title: "Employment Documents",
    desc: "Acknowledge required policies",
    status: "pending",
    to: "/documents",
  },
  {
    id: "rt3",
    title: "I-9 Readiness",
    desc: "Review eligibility verification requirements",
    status: "pending",
    to: "/i9",
  },
  {
    id: "rt4",
    title: "Safety Footwear",
    desc: "Obtain required safety footwear",
    status: "pending",
    to: "/safety",
  },
  {
    id: "rt5",
    title: "Shift Selection",
    desc: "Select your available work schedule",
    status: "pending",
    to: "/shift/select",
  },
  {
    id: "rt6",
    title: "Photo for Badge",
    desc: "Complete badge photo requirements",
    status: "locked",
    to: "/photo",
  },
  {
    id: "rt7",
    title: "Start Work",
    desc: "Review first day instructions",
    status: "locked",
    to: "/first-day",
  },
];

// ==========================
// Stepper state (controla el progreso visual)
// ==========================
export const stepperState = {
  steps: ["Apply", "Docs", "I-9", "PPE", "Shift", "Photo", "Start"],
  currentIndex: 1, // 0 = Apply, 1 = Docs
};

// ==========================
// Notifications
// ==========================
export const notifications = [
  {
    id: "n1",
    title: "Reminder: Bring your I-9 documents on your first day",
    body: "Make sure to bring your identification documents for the I-9 form on your start date.",
    cta: "View I-9 Readiness",
    type: "info",
  },
  {
    id: "n2",
    title: "Please Confirm Your Work Shift",
    body: "Select your preferred work schedule to confirm your shift.",
    cta: "Go to Shift Selection",
    type: "action",
    link: "/shift/select",
  },
  {
    id: "n3",
    title: "Safety Footwear: Don’t Forget to Order",
    body: "Visit our safety footwear program to use your allowance.",
    cta: "Shop Safety Footwear",
    type: "info",
  },
];

// ==========================
// FAQ
// ==========================
export const faq = [
  {
    q: "What documents do I need for the I-9 process?",
    a: "Bring documents that verify your identity and employment authorization. You choose acceptable documents (List A OR List B + List C). Originals only.",
  },
  {
    q: "Where can my shift be confirmed?",
    a: "Your shift is confirmed after selection and during onboarding/orientation.",
  },
  {
    q: "Where can I buy the required safety shoes?",
    a: "Use the vendor link provided in the Safety Footwear section when available.",
  },
  {
    q: "What should I bring on my first day?",
    a: "Bring I-9 original documents and approved safety footwear.",
  },
  {
    q: "Who do I contact if I’m running late or need to call in sick?",
    a: "Contact your Shift Supervisor / Lead or HR for attendance issues.",
  },
];

// ==========================
// Contacts
// ==========================
export const contacts = [
  {
    title: "Site Manager",
    desc: "Responsible for overall site operations",
    phone: "(555) 123-4567",
    email: "sitename.manager@email.com",
  },
  {
    title: "Shift Supervisor / Lead",
    desc: "Direct contact during your shift for attendance and operational issues",
    phone: "(555) 987-6543",
    email: "shift.lead@email.com",
  },
  {
    title: "HR / People Operations",
    desc: "Assistance with HR matters, documents, onboarding",
    phone: "(555) 456-7890",
    email: "hr@example.com",
  },
  {
    title: "Safety Officer",
    desc: "Reporting accidents, PPE, safety concerns",
    phone: "(555) 321-0009",
    email: "safety@example.com",
  },
];

// ==========================
// Shift choices
// ==========================
export const shiftChoices = [
  {
    id: "early",
    title: "Early Shift",
    hours: "6:00 AM – 2:30 PM",
    meta: "(8-Hour)",
    roles: [
      "Solar Panel Assembler",
      "Material Handler / Warehouse Associate",
      "Quality Control / Inspection Associate",
    ],
  },
  {
    id: "mid",
    title: "Mid Shift",
    hours: "2:00 PM – 10:30 PM",
    meta: "(8-Hour)",
    roles: [
      "Solar Panel Assembler",
      "Material Handler / Warehouse Associate",
      "Quality Control / Inspection Associate",
    ],
  },
  {
    id: "late",
    title: "Late Shift",
    hours: "10:00 PM – 6:30 AM",
    meta: "(8-Hour)",
    roles: [
      "Solar Panel Assembler",
      "Material Handler / Warehouse Associate",
      "Quality Control / Inspection Associate",
    ],
  },
];
