"use client"

import { ComplaintProvider } from "@/lib/complaint-context"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ComplaintsTable } from "@/components/complaints-table"
import { DashboardStats } from "@/components/dashboard-stats"
import { useAuth } from "@/lib/auth-context"
import type { Complaint } from "@/lib/data"

export default function HodDashboard() {
  const { user } = useAuth()

  // Filter complaints assigned to this HOD
  const filterAssignedComplaints = (complaint: Complaint) => {
    if (!user) return false
    return complaint.currentHandler === user.id
  }

  return (
    <ProtectedRoute allowedRoles={["hod"]}>
      <ComplaintProvider>
        <DashboardLayout>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">HOD Dashboard</h1>

            <DashboardStats filter={filterAssignedComplaints} />

            <ComplaintsTable
              title="Forwarded Complaints"
              description="Manage complaints forwarded to you"
              filter={filterAssignedComplaints}
            />
          </div>
        </DashboardLayout>
      </ComplaintProvider>
    </ProtectedRoute>
  )
}

