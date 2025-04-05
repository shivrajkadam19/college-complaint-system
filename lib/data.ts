export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "student" | "teacher" | "hod" | "principal"
  class?: string
  department?: string
}

export interface ComplaintLog {
  action: "created" | "forwarded" | "resolved" | "rejected"
  updatedBy: string
  note: string
  timestamp: string
}

export interface Complaint {
  id: string
  title: string
  description: string
  createdBy: string
  assignedTo: string
  currentHandler: string
  status: "pending" | "forwarded" | "resolved" | "rejected"
  resolutionNote: string
  timestamps: {
    createdAt: string
    updatedAt: string
    resolvedAt: string
    rejectedAt: string
  }
  logs: ComplaintLog[]
}

// Mock users data
export const users: User[] = [
  { id: "u1", name: "Alice", email: "alice@college.edu", password: "123", role: "student", class: "CS-A" },
  { id: "u2", name: "Bob", email: "bob@college.edu", password: "123", role: "student", class: "CS-B" },
  { id: "u3", name: "Mr. Smith", email: "smith@college.edu", password: "123", role: "teacher", class: "CS-A" },
  { id: "u4", name: "Ms. Johnson", email: "johnson@college.edu", password: "123", role: "teacher", class: "CS-B" },
  { id: "u5", name: "Dr. Rao", email: "rao@college.edu", password: "123", role: "hod", department: "CS" },
  { id: "u6", name: "Dr. Kumar", email: "kumar@college.edu", password: "123", role: "hod", department: "EE" },
  { id: "u7", name: "Principal Patil", email: "patil@college.edu", password: "123", role: "principal" },
]

// Mock complaints data
export const initialComplaints: Complaint[] = [
  {
    id: "c1",
    title: "WiFi not working",
    description: "WiFi is down in the CS lab. We cannot access online resources for our project.",
    createdBy: "u1",
    assignedTo: "u3",
    currentHandler: "u3",
    status: "pending",
    resolutionNote: "",
    timestamps: {
      createdAt: "2025-04-01T10:00:00Z",
      updatedAt: "2025-04-01T10:00:00Z",
      resolvedAt: "",
      rejectedAt: "",
    },
    logs: [{ action: "created", updatedBy: "u1", note: "", timestamp: "2025-04-01T10:00:00Z" }],
  },
  {
    id: "c2",
    title: "Projector not working",
    description: "The projector in Room 101 is not displaying properly. Colors are distorted.",
    createdBy: "u2",
    assignedTo: "u4",
    currentHandler: "u4",
    status: "pending",
    resolutionNote: "",
    timestamps: {
      createdAt: "2025-04-02T14:30:00Z",
      updatedAt: "2025-04-02T14:30:00Z",
      resolvedAt: "",
      rejectedAt: "",
    },
    logs: [{ action: "created", updatedBy: "u2", note: "", timestamp: "2025-04-02T14:30:00Z" }],
  },
  {
    id: "c3",
    title: "AC not cooling",
    description: "The air conditioner in the CS-A classroom is not cooling properly.",
    createdBy: "u1",
    assignedTo: "u3",
    currentHandler: "u5",
    status: "forwarded",
    resolutionNote: "",
    timestamps: {
      createdAt: "2025-04-03T09:15:00Z",
      updatedAt: "2025-04-03T11:20:00Z",
      resolvedAt: "",
      rejectedAt: "",
    },
    logs: [
      { action: "created", updatedBy: "u1", note: "", timestamp: "2025-04-03T09:15:00Z" },
      {
        action: "forwarded",
        updatedBy: "u3",
        note: "This requires department approval for repair.",
        timestamp: "2025-04-03T11:20:00Z",
      },
    ],
  },
  {
    id: "c4",
    title: "Library books outdated",
    description: "The programming books in the library are outdated. We need newer editions.",
    createdBy: "u2",
    assignedTo: "u4",
    currentHandler: "u7",
    status: "forwarded",
    resolutionNote: "",
    timestamps: {
      createdAt: "2025-04-04T13:45:00Z",
      updatedAt: "2025-04-05T09:30:00Z",
      resolvedAt: "",
      rejectedAt: "",
    },
    logs: [
      { action: "created", updatedBy: "u2", note: "", timestamp: "2025-04-04T13:45:00Z" },
      { action: "forwarded", updatedBy: "u4", note: "This is a valid concern.", timestamp: "2025-04-04T15:20:00Z" },
      {
        action: "forwarded",
        updatedBy: "u6",
        note: "This requires budget approval.",
        timestamp: "2025-04-05T09:30:00Z",
      },
    ],
  },
  {
    id: "c5",
    title: "Canteen food quality",
    description:
      "The quality of food in the canteen has deteriorated. Many students have complained of stomach issues.",
    createdBy: "u1",
    assignedTo: "u3",
    currentHandler: "u3",
    status: "resolved",
    resolutionNote: "Spoke with the canteen manager. They will improve the quality and hygiene standards.",
    timestamps: {
      createdAt: "2025-04-01T11:30:00Z",
      updatedAt: "2025-04-02T10:15:00Z",
      resolvedAt: "2025-04-02T10:15:00Z",
      rejectedAt: "",
    },
    logs: [
      { action: "created", updatedBy: "u1", note: "", timestamp: "2025-04-01T11:30:00Z" },
      {
        action: "resolved",
        updatedBy: "u3",
        note: "Spoke with the canteen manager. They will improve the quality and hygiene standards.",
        timestamp: "2025-04-02T10:15:00Z",
      },
    ],
  },
]

