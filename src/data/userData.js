export const dummyUsers = {
  // 1. MASTER ADMIN (Hardcoded access)
  admin: {
    email: "admin@vynx.in",
    password: "vynx2025",
    role: "admin",
    name: "Master Admin"
  },

  // 2. BUSINESS UNITS (Created by Admin offline)
  businessUnits: [
    {
      id: "U-101",
      email: "design@vynx.in",
      password: "design123",
      role: "business",
      name: "Interior Design Unit",
      location: "Dubai Marina"
    },
    {
      id: "U-102",
      email: "it@vynx.in",
      password: "it123",
      role: "business",
      name: "IT Solutions",
      location: "Business Bay"
    }
  ],

  // 3. AGENTS (Simulating people who already signed up)
  agents: [
    {
      id: "A-401",
      email: "zaid@vynx.in",
      password: "zaid123",
      role: "agent",
      name: "Zaid Al-Farsi",
      phone: "91501234567"
    },
    {
      id: "A-402",
      email: "sarah@vynx.in",
      password: "sarah123",
      role: "agent",
      name: "Sarah Mehmood",
      phone: "91559876543"
    }
  ]
};