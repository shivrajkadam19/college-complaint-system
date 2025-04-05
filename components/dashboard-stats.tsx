"use client"

import { useComplaints } from "@/lib/complaint-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react"
import type { Complaint } from "@/lib/data"

interface DashboardStatsProps {
  filter?: (complaint: Complaint) => boolean
}

export function DashboardStats({ filter }: DashboardStatsProps) {
  const { complaints } = useComplaints()
  const { user } = useAuth()

  if (!user) return null

  // Filter complaints based on the provided filter function
  const filteredComplaints = complaints.filter(filter || (() => true))

  // Count complaints by status
  const totalComplaints = filteredComplaints.length
  const pendingComplaints = filteredComplaints.filter((c) => c.status === "pending").length
  const forwardedComplaints = filteredComplaints.filter((c) => c.status === "forwarded").length
  const resolvedComplaints = filteredComplaints.filter((c) => c.status === "resolved").length
  const rejectedComplaints = filteredComplaints.filter((c) => c.status === "rejected").length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalComplaints}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingComplaints + forwardedComplaints}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolvedComplaints}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rejectedComplaints}</div>
        </CardContent>
      </Card>
    </div>
  )
}

