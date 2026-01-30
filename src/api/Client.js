// src/api/Client.js
// Mock local TEMPORAL para que el UI compile sin Firebase/backend.
// - `api.*` existe (pero NO implementado aún)
// - `base44` existe (mock legacy para pantallas que lo usan)

function notImplemented(name) {
  return async () => {
    throw new Error(
      `[api] ${name} not implemented yet. Hook this to Firebase/backend later.`
    );
  };
}

// ✅ API “moderna” (Admin* components importan esto)
export const api = {
  Document: {
    list: notImplemented("Document.list"),
    create: notImplemented("Document.create"),
    update: notImplemented("Document.update"),
    delete: notImplemented("Document.delete"),
  },
  FeedPost: {
    list: notImplemented("FeedPost.list"),
    create: notImplemented("FeedPost.create"),
    update: notImplemented("FeedPost.update"),
    delete: notImplemented("FeedPost.delete"),
  },
  Shift: {
    list: notImplemented("Shift.list"),
    create: notImplemented("Shift.create"),
    update: notImplemented("Shift.update"),
    delete: notImplemented("Shift.delete"),
  },
  User: {
    list: notImplemented("User.list"),
    update: notImplemented("User.update"),
  },
  OnboardingTask: {
    list: notImplemented("OnboardingTask.list"),
    create: notImplemented("OnboardingTask.create"),
    update: notImplemented("OnboardingTask.update"),
    delete: notImplemented("OnboardingTask.delete"),
  },
};

/* =========================================================
   base44 mock (legacy) — solo para no romper imports viejos
   ========================================================= */

const LS_USER_KEY = "spabc_mock_user";
const LS_NOTIFS_KEY = "spabc_mock_notifs";
const LS_SETUP_KEY_PREFIX = "spabc_mock_employment_setup:"; // per-user
const LS_SHIFTS_KEY_PREFIX = "spabc_mock_shifts:"; // per-user

function safeJSONParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function deriveStateFromEmployeeStatus(employee_status) {
  return employee_status === "active" ? "active" : "pending";
}

function getOrCreateUser() {
  const raw = localStorage.getItem(LS_USER_KEY);
  if (raw) {
    const u = safeJSONParse(raw, null);
    if (u) {
      if (!u.state) u.state = deriveStateFromEmployeeStatus(u.employee_status);
      return u;
    }
  }

  const user = {
    email: "demo@sunpowerabc.com",
    employee_id: "ABC-1001",
    passed_id_gate: true,
    access_revoked: false,
    access_revoked_reason: "",

    employee_status: "pending",
    setup_status: "in_progress",
    needs_fix_note: "",
    start_date: null,
    arrival_time: "",
    location: "",

    state: "pending",
  };

  localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
  return user;
}

function saveUser(patch) {
  const current = getOrCreateUser();
  const next = { ...current, ...patch };

  if (patch.employee_status && !patch.state) {
    next.state = deriveStateFromEmployeeStatus(patch.employee_status);
  }
  if (patch.state && !patch.employee_status) {
    next.employee_status = patch.state;
  }

  localStorage.setItem(LS_USER_KEY, JSON.stringify(next));
  return next;
}

function setupKey(userEmail) {
  return `${LS_SETUP_KEY_PREFIX}${userEmail}`;
}

function shiftsKey(userEmail) {
  return `${LS_SHIFTS_KEY_PREFIX}${userEmail}`;
}

function getOrCreateSetup(userEmail) {
  const raw = localStorage.getItem(setupKey(userEmail));
  const existing = safeJSONParse(raw, null);
  if (existing) return existing;

  const setup = {
    id: `setup_${userEmail}`,
    user_email: userEmail,
    screen_2_completed: false,
    screen_3_completed: false,
    screen_4_completed: false,
    screen_6_completed: false,
    screen_7_completed: false,
    ppe_status: "pending",
    ppe_acknowledged: false,
  };

  localStorage.setItem(setupKey(userEmail), JSON.stringify(setup));
  return setup;
}

function getOrCreateNotifs(userEmail) {
  const raw = localStorage.getItem(LS_NOTIFS_KEY);
  const list = safeJSONParse(raw, []);
  const filtered = list.filter((n) => n.user_email === userEmail);

  if (filtered.length > 0) return list;

  const seed = [
    {
      id: "n1",
      user_email: userEmail,
      is_read: false,
      title: "Reminder: Bring your I-9 documents on your first day",
      message:
        "Make sure to bring your identification documents for the I-9 form on your start date.",
      type: "info",
      created_date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "n2",
      user_email: userEmail,
      is_read: false,
      title: "Please Confirm Your Work Shift",
      message: "Select your preferred work schedule to confirm your shift.",
      type: "needs_fix",
      created_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "n3",
      user_email: userEmail,
      is_read: true,
      title: "Safety Footwear: Don’t Forget to Order",
      message: "Visit our safety footwear program to use your allowance.",
      type: "info",
      created_date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ];

  const next = [...list, ...seed];
  localStorage.setItem(LS_NOTIFS_KEY, JSON.stringify(next));
  return next;
}

function getOrCreateShifts(userEmail) {
  const raw = localStorage.getItem(shiftsKey(userEmail));
  const existing = safeJSONParse(raw, null);
  if (existing && Array.isArray(existing)) return existing;

  const today = new Date();
  const seed = [
    {
      id: "s1",
      user_email: userEmail,
      date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).toISOString(),
      start_time: "6:00 AM",
      end_time: "2:30 PM",
      location: "Plant A",
    },
    {
      id: "s2",
      user_email: userEmail,
      date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 2
      ).toISOString(),
      start_time: "2:00 PM",
      end_time: "10:30 PM",
      location: "Plant A",
    },
  ];

  localStorage.setItem(shiftsKey(userEmail), JSON.stringify(seed));
  return seed;
}

// ✅ Export legacy base44 (compat)
export const base44 = {
  auth: {
    async me() {
      return getOrCreateUser();
    },
    async logout() {
      localStorage.removeItem(LS_USER_KEY);
      window.location.hash = "#/";
    },
    async updateMe(patch) {
      return saveUser(patch);
    },
  },

  entities: {
    Notification: {
      async filter(where = {}, orderBy) {
        const { user_email, is_read } = where || {};
        if (!user_email) return [];

        const all = getOrCreateNotifs(user_email);
        let list = all.filter((n) => n.user_email === user_email);

        if (typeof is_read === "boolean") list = list.filter((n) => n.is_read === is_read);

        if (orderBy === "-created_date") {
          list = list.sort((a, b) => (a.created_date < b.created_date ? 1 : -1));
        } else if (orderBy === "created_date") {
          list = list.sort((a, b) => (a.created_date > b.created_date ? 1 : -1));
        }
        return list;
      },

      async update(notifId, patch) {
        const raw = localStorage.getItem(LS_NOTIFS_KEY);
        const list = safeJSONParse(raw, []);
        const idx = list.findIndex((n) => n.id === notifId);
        if (idx === -1) return null;

        const next = [...list];
        next[idx] = { ...next[idx], ...patch };
        localStorage.setItem(LS_NOTIFS_KEY, JSON.stringify(next));
        return next[idx];
      },
    },

    EmploymentSetup: {
      async filter({ user_email }) {
        if (!user_email) return [];
        return [getOrCreateSetup(user_email)];
      },
      async create({ user_email }) {
        if (!user_email) throw new Error("user_email is required");
        return getOrCreateSetup(user_email);
      },
      async update(user_email, patch) {
        if (!user_email) throw new Error("user_email is required");
        const current = getOrCreateSetup(user_email);
        const next = { ...current, ...patch };
        localStorage.setItem(setupKey(user_email), JSON.stringify(next));
        return next;
      },
    },

    Shift: {
      async filter(where = {}, orderBy) {
        const { user_email } = where || {};
        if (!user_email) return [];

        let list = getOrCreateShifts(user_email).filter((s) => s.user_email === user_email);

        if (orderBy === "date") list = list.sort((a, b) => (a.date > b.date ? 1 : -1));
        if (orderBy === "-date") list = list.sort((a, b) => (a.date < b.date ? 1 : -1));

        return list;
      },
    },
  },
};
