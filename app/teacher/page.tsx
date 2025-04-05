"use client"

import { ComplaintProvider } from "@/lib/complaint-context"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ComplaintsTable } from "@/components/complaints-table"
import { DashboardStats } from "@/components/dashboard-stats"
import { useAuth } from "@/lib/auth-context"
import type { Complaint } from "@/lib/data"

export default function TeacherDashboard() {
  const { user } = useAuth()

  // Filter complaints assigned to this teacher
  const filterAssignedComplaints = (complaint: Complaint) => {
    if (!user) return false
    return complaint.currentHandler === user.id
  }

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <ComplaintProvider>
        <DashboardLayout>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

            <DashboardStats filter={filterAssignedComplaints} />

            <ComplaintsTable
              title="Assigned Complaints"
              description="Manage complaints assigned to you"
              filter={filterAssignedComplaints}
            />
          </div>
        </DashboardLayout>
      </ComplaintProvider>
    </ProtectedRoute>
  )
}

