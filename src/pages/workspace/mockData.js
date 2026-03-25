export const PROJECT_DATA = {
  1: {
    name: "DevCollab Platform",
    members: [
      {
        id: "u1",
        name: "Vrushabh Darekar",
        role: "owner",
        avatar: "V",
        skills: ["React", "Node.js", "MongoDB"],
      },
      {
        id: "u2",
        name: "Arjun Mehta",
        role: "member",
        avatar: "A",
        skills: ["MongoDB", "Express.js"],
      },
      {
        id: "u3",
        name: "Priya Shah",
        role: "member",
        avatar: "P",
        skills: ["UI/UX", "Tailwind CSS"],
      },
    ],
    tasks: [
      {
        _id: "t1",
        title: "Setup project structure",
        assignedTo: "Vrushabh Darekar",
        priority: "high",
        status: "completed",
        dueDate: "2025-03-20",
      },
      {
        _id: "t2",
        title: "Build authentication module",
        assignedTo: "Arjun Mehta",
        priority: "high",
        status: "in-progress",
        dueDate: "2025-03-24",
      },
      {
        _id: "t3",
        title: "Design landing page",
        assignedTo: "Priya Shah",
        priority: "medium",
        status: "todo",
        dueDate: "2025-03-24",
      },
      {
        _id: "t4",
        title: "Integrate MongoDB models",
        assignedTo: "Arjun Mehta",
        priority: "medium",
        status: "todo",
        dueDate: "2025-03-18",
      },
      {
        _id: "t5",
        title: "Write API documentation",
        assignedTo: "Vrushabh Darekar",
        priority: "low",
        status: "todo",
        dueDate: "2025-03-30",
      },
    ],
  },

  2: {
    name: "AI Resume Analyzer",
    members: [
      {
        id: "u1",
        name: "Vrushabh Darekar",
        role: "owner",
        avatar: "V",
        skills: ["Python", "Flask"],
      },
      {
        id: "u4",
        name: "Rahul Verma",
        role: "member",
        avatar: "R",
        skills: "ML, Python, NLP",
      },
    ],
    tasks: [
      {
        _id: "t1",
        title: "Train NLP model",
        assignedTo: "Rahul Verma",
        priority: "high",
        status: "in-progress",
        dueDate: "2025-03-24",
      },
      {
        _id: "t2",
        title: "Build Flask API",
        assignedTo: "Vrushabh Darekar",
        priority: "high",
        status: "todo",
        dueDate: "2025-03-22",
      },
      {
        _id: "t3",
        title: "Design result dashboard",
        assignedTo: "Vrushabh Darekar",
        priority: "low",
        status: "todo",
        dueDate: "2025-04-01",
      },
    ],
  },

  3: {
    name: "E-Commerce App",
    members: [
      {
        id: "u5",
        name: "Sneha Kulkarni",
        role: "owner",
        avatar: "S",
        skills: ["React", "Redux"],
      },
      {
        id: "u1",
        name: "Vrushabh Darekar",
        role: "member",
        avatar: "V",
        skills: ["Node.js", "Express", "Stripe"],
      },
      {
        id: "u6",
        name: "Dev Patel",
        role: "member",
        avatar: "D",
        skills: "React, TypeScript",
      },
    ],
    tasks: [
      {
        _id: "t1",
        title: "Setup Stripe payments",
        assignedTo: "Vrushabh Darekar",
        priority: "high",
        status: "todo",
        dueDate: "2025-03-24",
      },
      {
        _id: "t2",
        title: "Product listing page",
        assignedTo: "Sneha Kulkarni",
        priority: "medium",
        status: "completed",
        dueDate: "2025-03-15",
      },
      {
        _id: "t3",
        title: "Shopping cart logic",
        assignedTo: "Dev Patel",
        priority: "high",
        status: "in-progress",
        dueDate: "2025-03-26",
      },
      {
        _id: "t4",
        title: "Order confirmation emails",
        assignedTo: "Vrushabh Darekar",
        priority: "low",
        status: "todo",
        dueDate: "2025-03-18",
      },
    ],
  },
};

// ── Shared helpers ─────────────────────────────────────────────────────────

export const TODAY = new Date().toISOString().split("T")[0];

export const priorityStyle = (p) =>
  ({
    high: "bg-red-500/10 text-red-400 border border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    low: "bg-green-500/10 text-green-400 border border-green-500/20",
  }[p] || "");

export const statusStyle = (s) =>
  ({
    completed: "bg-green-500/10 text-green-400 border border-green-500/20",
    "in-progress": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    todo: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
  }[s] || "");

export const statusLabel = (s) =>
  ({
    completed: "Completed",
    "in-progress": "In Progress",
    todo: "To Do",
  }[s] || s);