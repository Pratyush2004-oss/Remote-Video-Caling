"use client";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUi from "@/components/shared/LoaderUi";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, XCircle } from "lucide-react";
import { format } from "date-fns";
type Interview = Doc<"interviews">;
function DashboardPage() {
  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);

  const handleUpdateStatus = async (
    interveiewId: Id<"interviews">,
    status: string
  ) => {
    try {
      await updateStatus({ id: interveiewId, status });
      toast.success(`Interview marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update interview status");
    }
  };

  if (!interviews || !users) return <LoaderUi />;

  const groupedInterviews = groupInterviews(interviews);
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href={"/schedule"}>
          <Button>Schedule New Interview</Button>
        </Link>
      </div>
      <div className="space-y-8">
        {INTERVIEW_CATEGORY.map(
          (category) =>
            groupedInterviews[category.id]?.length > 0 && (
              <section key={category.id}>
                {/* Category Title  */}
                <div className="flex gap-2 items-center mb-4">
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                  <Badge variant={category.variant}>
                    {groupedInterviews[category.id].length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedInterviews[category.id].map(
                    (interview: Interview) => {
                      const candidateInfo = getCandidateInfo(
                        users,
                        interview.candidateId
                      );
                      const startTime = new Date(interview.startTime);
                      return (
                        <Card
                          className="hover:shadow-md transition-all"
                          key={interview._id}
                        >
                          {/* CANDIDATE INFO */}
                          <CardHeader className="p-4">
                            <Avatar className="size-10">
                              <AvatarImage src={candidateInfo.image} />
                              <AvatarFallback>
                                {candidateInfo.initials}
                              </AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-base">
                              {candidateInfo.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {interview.title}
                            </p>
                          </CardHeader>

                          {/* DATE & TIME */}
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex gap-1 items-center">
                                <CalendarIcon className="size-4" />
                                {format(startTime, "MMM dd")}
                              </div>
                              <div className="flex gap-1 items-center">
                                <CalendarIcon className="size-4" />
                                {format(startTime, "h:mm a")}
                              </div>
                            </div>
                          </CardContent>

                          {/* PASS & FAIL Btns */}
                          <CardFooter className="p-4 flex flex-col gap-3">
                            {interview.status === "completed" && (
                              <div className="flex gap-2 w-full">
                                <Button
                                  className="flex-1"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      interview._id,
                                      "succeeded"
                                    )
                                  }
                                >Pass</Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      interview._id,
                                      "failed"
                                    )
                                  }
                                ><XCircle className="size-4 mr-2"/>Fail</Button>

                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      );
                    }
                  )}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
