"use client"

import { ComplaintProvider } from "@/lib/complaint-context"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ComplaintForm } from "@/components/complaint-form"
import { ComplaintsTable } from "@/components/complaints-table"
import { DashboardStats } from "@/components/dashboard-stats"
import { useAuth } from "@/lib/auth-context"
import type { Complaint } from "@/lib/data"

export default function StudentDashboard() {
  const { user } = useAuth()

  // Filter complaints created by this student
  const filterMyComplaints = (complaint: Complaint) => {
    if (!user) return false
    return complaint.createdBy === user.id
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <ComplaintProvider>
        <DashboardLayout>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Student Dashboard</h1>

            <DashboardStats filter={filterMyComplaints} />

            <div className="grid gap-6 md:grid-cols-2">
              <ComplaintForm />

              <ComplaintsTable
                title="My Complaints"
                description="View and track your submitted complaints"
                filter={filterMyComplaints}
              />
            </div>
          </div>
        </DashboardLayout>
      </ComplaintProvider>
    </ProtectedRoute>
  )
}

