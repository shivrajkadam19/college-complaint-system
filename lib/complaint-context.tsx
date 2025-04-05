"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { type Complaint, initialComplaints, users } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"

interface ComplaintContextType {
  complaints: Complaint[]
  addComplaint: (title: string, description: string) => void
  resolveComplaint: (id: string, note: string) => void
  rejectComplaint: (id: string, note: string) => void
  forwardComplaint: (id: string, note: string) => void
  getUserById: (id: string) => { name: string; email: string } | undefined
  getComplaintById: (id: string) => Complaint | undefined
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined)

export function ComplaintProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Load complaints from localStorage or use initial data
    const storedComplaints = localStorage.getItem("complaints")
    if (storedComplaints) {
      setComplaints(JSON.parse(storedComplaints))
    } else {
      setComplaints(initialComplaints)
      localStorage.setItem("complaints", JSON.stringify(initialComplaints))
    }
  }, [])

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    if (complaints.length > 0) {
      localStorage.setItem("complaints", JSON.stringify(complaints))
    }
  }, [complaints])

  const getUserById = (id: string) => {
    const foundUser = users.find((u) => u.id === id)
    if (foundUser) {
      return { name: foundUser.name, email: foundUser.email }
    }
    return undefined
  }

  const getComplaintById = (id: string) => {
    return complaints.find((c) => c.id === id)
  }

  const addComplaint = (title: string, description: string) => {
    if (!user) return

    // Find the teacher for this student's class
    const teacher = users.find((u) => u.role === "teacher" && u.class === user.class)

    if (!teacher) {
      toast({
        title: "Error",
        description: "No teacher found for your class",
        variant: "destructive",
      })
      return
    }

    const now = new Date().toISOString()
    const newComplaint: Complaint = {
      id: `c${complaints.length + 1}`,
      title,
      description,
      createdBy: user.id,
      assignedTo: teacher.id,
      currentHandler: teacher.id,
      status: "pending",
      resolutionNote: "",
      timestamps: {
        createdAt: now,
        updatedAt: now,
        resolvedAt: "",
        rejectedAt: "",
      },
      logs: [{ action: "created", updatedBy: user.id, note: "", timestamp: now }],
    }

    setComplaints((prev) => [...prev, newComplaint])

    toast({
      title: "Complaint submitted",
      description: `Your complaint has been assigned to ${teacher.name}`,
    })

    // Simulate email notification
    setTimeout(() => {
      toast({
        title: "Email Notification",
        description: `To: ${teacher.email}\nNew complaint assigned: "${title}"`,
      })
    }, 1000)
  }

  const resolveComplaint = (id: string, note: string) => {
    if (!user) return

    const now = new Date().toISOString()

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          const updatedComplaint = {
            ...complaint,
            status: "resolved" as const,
            resolutionNote: note,
            timestamps: {
              ...complaint.timestamps,
              updatedAt: now,
              resolvedAt: now,
            },
            logs: [
              ...complaint.logs,
              {
                action: "resolved" as const,
                updatedBy: user.id,
                note,
                timestamp: now,
              },
            ],
          }

          // Simulate email notification
          const creator = users.find((u) => u.id === complaint.createdBy)
          if (creator) {
            setTimeout(() => {
              toast({
                title: "Email Notification",
                description: `To: ${creator.email}\nYour complaint "${complaint.title}" has been resolved.`,
              })
            }, 1000)
          }

          return updatedComplaint
        }
        return complaint
      }),
    )

    toast({
      title: "Complaint resolved",
      description: `The complaint has been marked as resolved`,
    })
  }

  const rejectComplaint = (id: string, note: string) => {
    if (!user) return

    const now = new Date().toISOString()

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          const updatedComplaint = {
            ...complaint,
            status: "rejected" as const,
            resolutionNote: note,
            timestamps: {
              ...complaint.timestamps,
              updatedAt: now,
              rejectedAt: now,
            },
            logs: [
              ...complaint.logs,
              {
                action: "rejected" as const,
                updatedBy: user.id,
                note,
                timestamp: now,
              },
            ],
          }

          // Simulate email notification
          const creator = users.find((u) => u.id === complaint.createdBy)
          if (creator) {
            setTimeout(() => {
              toast({
                title: "Email Notification",
                description: `To: ${creator.email}\nYour complaint "${complaint.title}" has been rejected.`,
              })
            }, 1000)
          }

          return updatedComplaint
        }
        return complaint
      }),
    )

    toast({
      title: "Complaint rejected",
      description: `The complaint has been rejected`,
    })
  }

  const forwardComplaint = (id: string, note: string) => {
    if (!user) return

    const now = new Date().toISOString()

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          let nextHandler

          // Determine next handler based on current handler's role
          if (user.role === "teacher") {
            // Forward to HOD of the department
            nextHandler = users.find((u) => u.role === "hod" && u.department === user.department)
          } else if (user.role === "hod") {
            // Forward to principal
            nextHandler = users.find((u) => u.role === "principal")
          }

          if (!nextHandler) {
            toast({
              title: "Error",
              description: "No appropriate handler found to forward this complaint",
              variant: "destructive",
            })
            return complaint
          }

          const updatedComplaint = {
            ...complaint,
            status: "forwarded" as const,
            currentHandler: nextHandler.id,
            timestamps: {
              ...complaint.timestamps,
              updatedAt: now,
            },
            logs: [
              ...complaint.logs,
              {
                action: "forwarded" as const,
                updatedBy: user.id,
                note,
                timestamp: now,
              },
            ],
          }

          // Simulate email notification
          setTimeout(() => {
            toast({
              title: "Email Notification",
              description: `To: ${nextHandler.email}\nA complaint has been forwarded to you: "${complaint.title}"`,
            })
          }, 1000)

          return updatedComplaint
        }
        return complaint
      }),
    )

    toast({
      title: "Complaint forwarded",
      description: `The complaint has been forwarded to the next level`,
    })
  }

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        addComplaint,
        resolveComplaint,
        rejectComplaint,
        forwardComplaint,
        getUserById,
        getComplaintById,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  )
}

export function useComplaints() {
  const context = useContext(ComplaintContext)
  if (context === undefined) {
    throw new Error("useComplaints must be used within a ComplaintProvider")
  }
  return context
}

