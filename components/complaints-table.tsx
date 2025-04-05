"use client"

import { useState } from "react"
import { useComplaints } from "@/lib/complaint-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Complaint } from "@/lib/data"
import { Eye, Search } from "lucide-react"
import { ComplaintDetails } from "@/components/complaint-details"

interface ComplaintsTableProps {
  title: string
  description?: string
  filter?: (complaint: Complaint) => boolean
}

export function ComplaintsTable({ title, description, filter }: ComplaintsTableProps) {
  const { complaints, getUserById } = useComplaints()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  if (!user) return null

  // Filter complaints based on the provided filter function and search term
  const filteredComplaints = complaints
    .filter(filter || (() => true))
    .filter(
      (complaint) =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        )
      case "forwarded":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Forwarded
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Resolved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  const viewComplaintDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setIsDetailsOpen(true)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search complaints..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No complaints found
                </TableCell>
              </TableRow>
            ) : (
              filteredComplaints.map((complaint) => {
                const creator = getUserById(complaint.createdBy)

                return (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">{complaint.title}</TableCell>
                    <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                    <TableCell>{creator?.name || "Unknown"}</TableCell>
                    <TableCell>{formatDate(complaint.timestamps.createdAt)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => viewComplaintDetails(complaint)}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedComplaint && (
            <ComplaintDetails complaint={selectedComplaint} onClose={() => setIsDetailsOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

