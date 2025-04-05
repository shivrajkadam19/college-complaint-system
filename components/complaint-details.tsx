"use client"

import { useState } from "react"
import { useComplaints } from "@/lib/complaint-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Complaint } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, ArrowRightCircle } from "lucide-react"

interface ComplaintDetailsProps {
  complaint: Complaint
  onClose: () => void
}

export function ComplaintDetails({ complaint, onClose }: ComplaintDetailsProps) {
  const [actionNote, setActionNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { resolveComplaint, rejectComplaint, forwardComplaint, getUserById } = useComplaints()
  const { user } = useAuth()

  if (!user) return null

  const isCurrentHandler = user.id === complaint.currentHandler
  const canTakeAction = isCurrentHandler && complaint.status !== "resolved" && complaint.status !== "rejected"
  const isPrincipal = user.role === "principal"

  const handleAction = async (action: "resolve" | "reject" | "forward") => {
    if (!actionNote.trim()) return

    setIsSubmitting(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    switch (action) {
      case "resolve":
        resolveComplaint(complaint.id, actionNote)
        break
      case "reject":
        rejectComplaint(complaint.id, actionNote)
        break
      case "forward":
        forwardComplaint(complaint.id, actionNote)
        break
    }

    setIsSubmitting(false)
    onClose()
  }

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

  return (
    <>
      <DialogHeader>
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogDescription>View and manage complaint information</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="details" className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{complaint.title}</h3>
              {getStatusBadge(complaint.status)}
            </div>

            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">
                Created by {getUserById(complaint.createdBy)?.name || "Unknown"} on{" "}
                {formatDate(complaint.timestamps.createdAt)}
              </div>

              <div className="mt-2">
                <p className="text-sm font-medium">Description:</p>
                <p className="mt-1 text-sm">{complaint.description}</p>
              </div>

              {complaint.status === "resolved" && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Resolution Note:</p>
                  <p className="mt-1 text-sm">{complaint.resolutionNote}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Resolved on {formatDate(complaint.timestamps.resolvedAt)}
                  </p>
                </div>
              )}

              {complaint.status === "rejected" && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Rejection Note:</p>
                  <p className="mt-1 text-sm">{complaint.resolutionNote}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Rejected on {formatDate(complaint.timestamps.rejectedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {canTakeAction && (
            <div className="mt-6">
              <Label htmlFor="action-note">Action Note</Label>
              <Textarea
                id="action-note"
                placeholder="Enter your note for this action..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="mt-2"
                rows={3}
              />

              <div className="flex gap-2 mt-4">
                <Button onClick={() => handleAction("resolve")} disabled={isSubmitting} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" /> Resolve
                </Button>

                <Button
                  onClick={() => handleAction("reject")}
                  disabled={isSubmitting}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>

                {!isPrincipal && (
                  <Button
                    onClick={() => handleAction("forward")}
                    disabled={isSubmitting}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowRightCircle className="h-4 w-4 mr-2" /> Forward
                  </Button>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="space-y-4">
            {complaint.logs.map((log, index) => (
              <Card key={index}>
                <CardHeader className="py-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {log.action}
                      </Badge>
                      <CardTitle className="text-sm">By {getUserById(log.updatedBy)?.name || "Unknown"}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">{formatDate(log.timestamp)}</CardDescription>
                  </div>
                </CardHeader>
                {log.note && (
                  <CardContent className="py-2">
                    <p className="text-sm">{log.note}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </>
  )
}

